'''
This file contains global variables to required to parameterise click functionality
'''

language = 'en'  # The CLI language selected by the user
non_interactive = False  # Whether or not to interactively prompt the user for input. (Useful for tests and debugging)
real_non_interactive = False  # Really be non-interactive (as tests rely on non_interactive but with output still)
skip_verify = False  # skip verification on generated keys (for testing purposes)
