# INVALID historical evidence

The old runner reported PASS under inherited NODE_TEST_CONTEXT=child-v8, but its log proves child tests were skipped. The retained receipt is INVALID and cannot support development or formal acceptance. The normal clean-shell run at the same source was a separate valid development observation. Two failing-to-passing real subprocess regressions now clear inherited context and require positive verified TAP counts.
