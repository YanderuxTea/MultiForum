'use client'
import InputAny from '@/components/shared/inputs/InputAny'
import {useState} from 'react'
import useTwoFactor from '@/hooks/useTwoFactor'
import useNotify from '@/hooks/useNotify'

export default function NotifyConfirmTwoFactor() {
  const [code, setCode] = useState<string>('')
  const twoFactor = useTwoFactor()
  const {setIsNotify, setMessage} = useNotify()
  const [confirm, setConfirm] = useState<boolean>(false)
  async function confirmCode() {
    if(code.trim().length === 0){
      setIsNotify(true)
      setMessage('Ошибка: вы не ввели код')
      return
    }else {
      const req = await fetch('/api/twoFactor/confirm', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({code:code})
      })
      const res = await req.json()
      if(res.ok){
        setIsNotify(true)
        setMessage(res.message)
        setConfirm(true)
      }else {
        setIsNotify(true)
        setMessage(`Ошибка: ${res.message}`)
      }
    }
  }
  return confirm?null:twoFactor?twoFactor.confirm?null :
    <div className='bg-black/25 fixed inset-0 flex items-center justify-center z-100'>
      <div className='bg-white dark:bg-[#212121] flex flex-col items-center p-5'>
        <p>Подтверждение</p>
        <InputAny placeholder='Введите код из приложения' name='confCode' onChange={setCode} value={code} id='confCodeid' type='text'/>
        <button onClick={()=>confirmCode()}>Подтвердить</button>
      </div>
    </div>
    :null
}