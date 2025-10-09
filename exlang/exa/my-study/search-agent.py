from langchain.agents import AgentExecutor
from dotenv import load_dotenv
from langchain import hub
from langchain.agents.react.agent import create_react_agent
from langchain_openai import ChatOpenAI
from langchain_tavily import TavilySearch
from langchain.tools import tool


load_dotenv()

tools = [TavilySearch()]
llm = ChatOpenAI(temperature=0, model="gpt-4")
react_prompt = hub.pull("hwchase17/react")
agent = create_react_agent(llm, tools, prompt=react_prompt)
agent_executor = AgentExecutor.from_agent_and_tools(agent=agent, tools=tools, verbose=True)
chain = agent_executor

def main(): 
    result = chain.invoke(
        input={
            "input": "search for 3 job postings for blockchain developer in remore world",
        }
    )
if __name__ == "__main__":
    main()