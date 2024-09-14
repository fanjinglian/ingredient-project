from langchain.chat_models import ChatOpenAI
from langchain_core.messages import AIMessage, HumanMessage
import os
from langchain_core.chat_history import (
    BaseChatMessageHistory,
    InMemoryChatMessageHistory,
)
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain.schema.runnable import RunnableConfig
from  langchain_core.prompts import MessagesPlaceholder
from langchain_core.prompts import ChatPromptTemplate


# 使用环境变量存储API密钥
os.environ["OPENAI_API_KEY"] = "your_actual_api_key_here"

# 初始化DeepSeek模型
model = ChatOpenAI(
    model_name="deepseek-chat",
    openai_api_key="sk-cb248349eff84c6cb730c14d8a9910b3",
    openai_api_base="https://api.deepseek.com",
    request_timeout=30  # 设置30秒超时
)#type:ignore

store={}
# 给定session_id，返回一个内存中的聊天历史
def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = InMemoryChatMessageHistory()
    return store[session_id]

prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "你是一个聊天机器人，尽你所能，回答所有问题。",
        ),
        MessagesPlaceholder(variable_name="messages"),
    ]
)

chain = prompt | model

# 使用RunnableWithMessageHistory包装模型，以便在聊天历史中使用
with_message_history = RunnableWithMessageHistory(chain, get_session_history)

# 创建config
config = RunnableConfig({"configurable": {"session_id": "abc21"}})

try:

    response = with_message_history.invoke(
    [HumanMessage(content="Hi!我是莉莉")],
    config=config,
    )
    print(response.content)

    response=with_message_history.invoke(
    [HumanMessage(content="我的名字是什么")],
    config=config,
    )
    print(response.content)
except Exception as e:
    print(f"An error occurred: {e}")