const selectElements = document.getElementsByClassName('lau')
const textinput = document.querySelector('.textarea')
const output = document.getElementById('output')
const btn = document.querySelector('.switch-btn')
const select1 = document.getElementById('select1')
const select2 = document.getElementById('select2')
const geminiIcon = document.getElementById('gemini-color')
const historyBtn = document.getElementById('history')
const historyWindow = document.querySelector('.history-window')
const overlay = document.getElementById("overlay");

let mainLau = localStorage.getItem('mainLang') || 'Afrikaans'
let toLau = localStorage.getItem('toLang') || 'Afrikaans';
let history = JSON.parse(localStorage.getItem('history')) || [];


const updateOption = (element,value) => {
    element.value = value
}

//从文件获取语言列表
const start = async() => {
    try {
        const get = await (await fetch('assets/lau.json'))
        const data = await get.json();
        dropDownBar(data)

        updateOption(select1,mainLau)
        updateOption(select2,toLau)
    }
    catch(error){
        console.log(error)
    }
}
start()

//将语言列表导入到下拉栏
const dropDownBar = (array) => {
    Array.from(selectElements).forEach((select) => {
        array.forEach((option) => {
           const op = document.createElement('option')
           op.value = option
           op.textContent = option
           select.appendChild(op)
        })
    })
}

//获取后端ai
const getAiData = async(prompt) => {
    output.innerText = "";

    if (!geminiIcon.parentNode) {
        output.appendChild(geminiIcon);  
    }

    geminiIcon.style.display = 'block'; 
     //console.log(prompt)

     try {
         const response = await fetch('cloudfront.wooze.tech/api/data', {
             method: "POST",
             headers: {
                 "Content-Type": "application/json",
             },
             body: JSON.stringify({ text:prompt ,language:toLau }),
         })
          
         const data = await response.json()
         geminiIcon.style.display = 'none'
         output.innerText = data.aitext
         history.unshift(data)
     } catch (error) {
         output.innerText = '无法获取信息'
     }
}




//事件监听模块

btn.addEventListener('click',() => {
    btn.classList.add('rotate')

    setTimeout(() => {
        btn.classList.remove('rotate')
    },500)
})



select1.addEventListener('change',(event)=> {
  mainLau = event.target.value
  console.log('用户的语言是',mainLau)
  localStorage.setItem('mainLang',mainLau)
})

select2.addEventListener('change',(event)=> {
    toLau = event.target.value
    console.log('用户要翻译的语言是',toLau)
    localStorage.setItem('toLang',toLau)
})

textinput.addEventListener('keydown',async(event) => {
    const key = event.key
    if (key === "Enter")
    {
        const prompt = textinput.value.trim()
    if(prompt === ''){
        alert('请输入文本')
        return
    }
    getAiData(prompt)

    
    
    }
 })

historyBtn.addEventListener('click',() => {
    historyWindow.style.display = 'block'
    overlay.style.display = 'block'
})

historyWindow.addEventListener('keydown',(event) => {
    const key = event.key
    console.log('key')
    if (key === 'esc') {
        historyWindow.style.display = 'none'
        overlay.style.display = 'none'
    }
})
