"use client";
import { useState } from "react";
import { Configuration, OpenAIApi } from "openai";
require('dotenv').config();



export default function Home() {
  const [markdownInput, setMarkdownInput] = useState<string>("");
  const [chatgptResponse, setChatGPTResponse] = useState<string>('');
  // const [result, setResult] = useState<string>("");

  const handleChangeConvertPrompt = (e: any) => {
    setMarkdownInput(e.target.value);
  };

  const handleChangeGetResult = (e: any) => {
    setChatGPTResponse(e.target.value);
  };

  const handleGenerateResponse = async () => {
    const htmlContent = markdownInput;

    if (htmlContent) {
      const prompts = htmlContent;

      // const openai_key = process.env.NEXT_PUBLIC_API_KEY

      const configuration = new Configuration({
        apiKey: process.env.NEXT_PUBLIC_API_KEY
      });
      const openai = new OpenAIApi(configuration);
      const content = '上記のマークダウン内容を詳細に正確に分析してください。\
                      次に、GPT用のプロンプトを作成する必要があります。\
                      どんなプロンプトですか？\
                      1.もし私がこのプロンプトをGPTに入れたら、結果の値に上記のマークダウン内容が反映されるようにプロンプトを生成します。\
                      2. マークダウン内容が正確に反映されるようにします。\
                      3. 一言でプロンプトをGPTに利用して、再び上記のマークダウン内容とほぼ同様のマークダウン内容が得られるようにすることです。\
                      4.マークダウンの内容を失わないように、マークダウン内容を完全に反映するようにプロンプトを作成する必要があります。';
      const real_prompts = `${prompts} \n \n \n ${content}`;
      
      const response = await openai.createChatCompletion({
        model: "gpt-4",
        max_tokens: 500,
        messages: [
          {
            "role": "user",
            "content": real_prompts
          }
  
        ]  
      })
      // print(response.choices[0].message.content)

      const result = response.data.choices[0]?.message?.content;

      const real = '上記の結果をすべてまとめて、その内容を詳細に含むプログラムコードで利用できるマークダウンソースコードを出力してください。\
                    マークダウンソースコードにはさまざまなマークダウンスタイルが適用されなければなりません。'

      const real_result = `${result} \n \n \n ${real}`;
      console.log(real_result);

      setChatGPTResponse(real_result);

    } else {
      alert('No text...')
    }


  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-7xl w-full items-center flex flex-col text-sm lg:flex">
        <div className="w-full">
          <h1 className="text-center text-[35px] font-bold text-[#494949]">
            マークダウンプロンプト
          </h1>
        </div>

        <div className="w-full flex justify-between mt-[40px] p-[10px]">
          <div className="flex flex-col gap-[30px]">
            <span className="text-[20px] text-center font-bold text-[#4d4d4d]">MarkDown</span>
            <textarea
              value={markdownInput}
              onChange={handleChangeConvertPrompt}
              className="border-[1px] border-[#787878] rounded-[7px] h-[35rem] w-[35rem] p-[15px] text-[16px]"
            ></textarea>
            <button
              onClick={handleGenerateResponse}
              className="inline-block px-6 py-2.5 text-[15px] font-medium leading-6 text-center text-white uppercase transition bg-green-500 rounded-full shadow ripple hover:shadow-lg hover:bg-green-600 focus:outline-none"
            >
              変換プロンプト
            </button>
          </div>
          <div className="flex flex-col gap-[30px]">
            <span className="text-[20px] text-center font-bold text-[#4d4d4d]">Prompt</span>
            <textarea
              readOnly
              value={chatgptResponse}
              onChange={handleChangeGetResult}
              className="border-[1px] border-[#161515] rounded-[7px] h-[35rem] w-[35rem] p-[15px] text-[16px]"
            ></textarea>
          </div>
        </div>
      </div>
    </main>
  );
}
