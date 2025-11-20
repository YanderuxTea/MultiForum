import Image from 'next/image'
import InputAny from '@/components/shared/inputs/InputAny'
import React from 'react'
import useNotify from '@/hooks/useNotify'
import IconVerify from '@/components/shared/icons/IconVerify'
import IconNoneVerify from '@/components/shared/icons/IconNoneVerify'
import useTwoFactor from '@/hooks/useTwoFactor'

export default function SetupAuth({pending, setPending}:{pending:boolean, setPending:React.TransitionStartFunction}) {
  const [qr, setQr] = React.useState<string>('')
  const [secret, setSecret] = React.useState<string>('')
  const [code, setCode] = React.useState<string>('')
  const {setMessage, setIsNotify} = useNotify()
  const twoFactor = useTwoFactor()
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
        setMessage(res.message)
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
          setMessage(`Ошибка: ${res.message}`)
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
        setMessage(res.message)
        setIsNotify(true)
      }
    })
  }
  return<div className='flex flex-col gap-2.5'>
    <p className='flex flex-row gap-2.5 text-neutral-700 dark:text-neutral-300 font-medium'>Двухфакторная аутентификация: {twoFactor ? <IconVerify/>:<IconNoneVerify/>}</p>
    {twoFactor?<button onClick={()=>handleDelete2fa()}>Удалить</button>:<button onClick={()=>handleSetup2fa()} className='bg-orange-500 dark:bg-orange-600 py-1.25 font-medium px-2.5 rounded-md max-w-max cursor-pointer transition-colors duration-300 ease-out hover:bg-orange-400 dark:hover:bg-orange-500 active:bg-orange-600 dark:active:bg-orange-700'>Настроить</button>}
    {qr.trim().length>0&& <div>
      <p>Отсканируйте приложением Google Authenticator</p>
      <Image src={qr} alt='qrCode' width={128} height={128}/>
      <p>Или вставьте этот ключ: {secret}</p>
      <InputAny type='text' placeholder='Введите код из приложения' name='code2fa' id='code2faId' value={code} onChange={setCode} readonly={pending}/>
      <button onClick={()=>handleConfirm2fa()}>Подключить</button>
    </div>}
  </div>




}