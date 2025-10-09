REACT_PROMPT_WITH_FORMAT_INSTRUCTIONS="""
Answer the following questions as best you can. You have access to the following tools:

{tools}

Use the following format:

Question: the input question you must answer
Thought: you should always think about what to do
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action
... (this Thought/Action/Action Input/Observation can repeat N times)
Thought: I now know the final answer
Final Answer: the final answer to the original input question formatted according to format_instructions: {format_instructions}

Begin!

Question: {input}
Thought:{agent_scratchpad}
"""
# The prompt from the following URL is used with minor modifications.
# https://smith.langchain.com/hub/hwchase17/react?organizationId=1740b0b3-69a3-45f4-a765-f65ac4e1ec2b