package city.utopia.control

import org.json.JSONObject
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test

// TEMPORARY review probe (not committed, not part of the product): feeds the reviewed head's OWN canonical monitor
// payloads - captured from a gateway running that head - to the Android projection, so check 9's Android half is an
// execution against real server bytes rather than a fixture or a source reading.
//
// A failure here would mean the Android surface cannot render what this head's server actually serves, which is a
// parity defect, not a test problem.
class ReviewedHeadContractParityTest {
    private fun resource(name: String) = javaClass.getResourceAsStream("/$name")!!.readBytes().toString(Charsets.UTF_8)

    @Test
    fun androidProjectionAcceptsTheReviewedHeadsOwnMonitorPayloads() {
        val graphResponse = JSONObject(resource("reviewed-head-monitor-graph.json"))
        val graph = graphResponse.getJSONObject("graph")
        val cityId = graph.getJSONObject("projectionOf").getString("cityId")

        val view = parseMonitorGraph(graphResponse, cityId)
        assertEquals("the projection keeps the City it came from", cityId, view.cityId)
        assertTrue("the reviewed head served at least one node", view.nodes.isNotEmpty())
        assertTrue("no node may be omitted from the layout", view.nodes.size >= view.visibleNodes().size)
        assertTrue("health must be one of the declared states",
            view.health in setOf("COMPLETE", "PARTIAL", "STALE", "UNAVAILABLE", "UNKNOWN"))

        // The same envelope the Web surface consumes must also parse as a decision observation.
        val decisionsResponse = JSONObject(resource("reviewed-head-monitor-decisions.json"))
        val decisions = parseMonitorDecisions(decisionsResponse, cityId)
        assertEquals("receipts carry the same City identity", cityId, decisions.getString("cityId"))
        assertNotNull("the observation declares its metrics", decisions.getJSONObject("metrics"))
        val receipts = decisions.getJSONObject("window").getJSONArray("decisions")
        for (index in 0 until receipts.length()) {
            val receipt = receipts.getJSONObject(index)
            assertTrue("receipt ${receipt.optString("decisionId")} must not claim to have been applied by the monitor",
                receipt.isNull("appliedBy") || receipt.optString("appliedBy").isEmpty())
        }

        println(
            "PARITY reviewed-head=${System.getProperty("parity.head") ?: "fb042d9"} cityId=$cityId " +
                "health=${view.health} nodes=${view.nodes.size} visible=${view.visibleNodes().size} " +
                "edges=${view.edges.size} clusters=${view.clusters.size} receipts=${receipts.length()} " +
                "-> Android projection ACCEPTED the server's own payloads"
        )
    }
}
