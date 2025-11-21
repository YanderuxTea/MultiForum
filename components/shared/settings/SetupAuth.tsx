import Image from 'next/image'
import InputAny from '@/components/shared/inputs/InputAny'
import React from 'react'
import useNotify from '@/hooks/useNotify'
import IconVerify from '@/components/shared/icons/IconVerify'
import IconNoneVerify from '@/components/shared/icons/IconNoneVerify'
import useTwoFactor from '@/hooks/useTwoFactor'

export default function SetupAuth({pending, setPending, isSecurePending}:{isSecurePending:boolean, pending:boolean, setPending:React.TransitionStartFunction}) {
  const [qr, setQr] = React.useState<string>('')
  const [secret, setSecret] = React.useState<string>('')
  const [code, setCode] = React.useState<string>('')
  const {setMessage, setIsNotify} = useNotify()
  const twoFactor = useTwoFactor()
  const [clipboard, setClipboard] = React.useState<string>('')
  async function handleSetup2fa() {
    setPending(async ()=>{
      const req = await fetch('/api/twoFactor/generate', {
        method: 'GET',
      })
      const res = await req.json()
      if(res.ok) {
        setQr(res.qr)
        setSecret(res.secret)
      }else {
        setMessage(`Ошибка: ${res.error??res.message}`)
        setIsNotify(true)
      }
    })
  }
  async function handleConfirm2fa(){
    setPending(async ()=>{
      if(code.trim().length === 0){
        setMessage('Ошибка: вы не ввели код из приложения')
        setIsNotify(true)
        return
      }else {
        const req = await fetch('/api/twoFactor/setup', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({code:code})
        })
        const res = await req.json()
        if(res.ok) {
          setMessage(res.message)
          setIsNotify(true)
          window.location.reload()
        }else {
          setMessage(`Ошибка: ${res.error??res.message}`)
          setIsNotify(true)
        }
      }
    })
  }
  async function handleDelete2fa() {
    setPending(async ()=>{
      const req = await fetch('/api/twoFactor/delete', {
        method: 'GET',
      })
      const res = await req.json()
      if(res.ok) {
        setMessage(res.message)
        setIsNotify(true)
        window.location.reload()
      }else {
        setMessage(`Ошибка: ${res.error??res.message}`)
        setIsNotify(true)
      }
    })
  }
  return<div className='flex flex-col gap-5'>
    <div className='flex flex-col gap-2.5'>
      <p className='flex flex-row gap-2.5 text-neutral-700 dark:text-neutral-300 font-medium'>Двухфакторная аутентификация: {twoFactor ? <IconVerify/>:<IconNoneVerify/>}</p>
      {twoFactor
        ?
        <button disabled={pending||isSecurePending} onClick={()=>handleDelete2fa()} className='bg-red-500 dark:bg-red-600 max-w-max px-2.5 py-1.25 rounded-md cursor-pointer transition-colors duration-300 ease-out hover:bg-red-400 dark:hover:bg-red-500 active:bg-red-600 dark:active:bg-red-700 font-medium text-white disabled:cursor-default disabled:bg-neutral-300 dark:disabled:bg-neutral-700'>{pending?'Удаляем':'Удалить'}</button>
        :
        <button disabled={pending||isSecurePending} onClick={()=>handleSetup2fa()} className='bg-orange-500 dark:bg-orange-600 py-1.25 font-medium px-2.5 rounded-md max-w-max cursor-pointer transition-colors duration-300 ease-out hover:bg-orange-400 dark:hover:bg-orange-500 active:bg-orange-600 dark:active:bg-orange-700 text-white disabled:cursor-default disabled:bg-neutral-300 dark:disabled:bg-neutral-700'>{qr.trim().length>0?pending?'Генерируем':'Поменять':pending?'Генерируем':'Включить'}</button>}
    </div>
    {qr.trim().length>0&&
      <div className='flex flex-col gap-2.5 items-center'>
        <p className='text-neutral-700 dark:text-neutral-300 font-medium text-center'>Отсканируйте приложением Google Authenticator</p>
        <Image draggable={false} src={qr} alt='qrCode' width={128} height={128} className='rounded-md'/>
        <p className='text-neutral-600 dark:text-neutral-400 font-medium'>Ключ: <button onClick={()=> {
          if(navigator.clipboard && navigator.clipboard.writeText){
            navigator.clipboard.writeText(secret).then(()=>{
              setClipboard(secret);
            })
          }else {
            const textarea = document.createElement("textarea");
            textarea.value = secret;
            textarea.style.position = "fixed";
            textarea.style.opacity = "0";
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand("copy");
            textarea.remove();
            setClipboard(secret);
          }
        }} className={`cursor-pointer transition-colors duration-300 ease-out ${clipboard === secret?'text-green-500 dark:text-green-600':'hover:text-neutral-700 dark:hover:text-neutral-300'}`}>{secret}</button></p>
        <InputAny type='text' placeholder='Введите код из приложения' name='code2fa' id='code2faId' value={code} onChange={setCode} readonly={pending}/>
        <button onClick={()=>handleConfirm2fa()} className='text-white bg-green-500 dark:bg-green-600 w-full py-1.25 rounded-md disabled:cursor-default disabled:bg-neutral-300 dark:disabled:bg-neutral-700 transition-colors duration-300 ease-out font-medium hover:bg-green-400 dark:hover:bg-green-500 active:bg-green-600 dark:active:bg-green-700 cursor-pointer' disabled={pending||isSecurePending}>{pending?'Подключаем':'Подключить'}</button>
      </div>
    }
  </div>




}