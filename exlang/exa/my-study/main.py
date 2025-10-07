# 3. Import everything with the updated paths
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI # <-- Updated import
from langchain.chains import LLMChain

# 4. Your code can now run as expected
summary_template = """
given the {information} about a person I want you to create:
1. A short summary
2. two interesting facts about them
"""

from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI

prompt = PromptTemplate.from_template("""given the {information} about a person create:
1) A short summary
2) Two interesting facts""")
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

chain = prompt | llm
result = chain.invoke({"information": "Lee Jae Myung"})
print(result.content)