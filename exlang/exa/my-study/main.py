from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langchain_ollama import ChatOllama

def main():
    summary_template = """
    Given the information {information} about a person, please provide:
    1. A short summary.
    2. Two interesting facts about them.
    """

    summary_prompt_template = PromptTemplate(
        input_variables=["information"],
        template=summary_template
    )

    # Choose model: GPT or Gemma
    use_openai = True  # toggle this as needed

    if use_openai:
        llm = ChatOpenAI(temperature=0, model="gpt-5")
    else:
        llm = ChatOllama(temperature=0, model="gemma3:270m")

    chain = summary_prompt_template | llm

    information = "Lee Jae-Myung"
    response = chain.invoke({"information": information})

    print(response.content)

if __name__ == "__main__":
    main()




