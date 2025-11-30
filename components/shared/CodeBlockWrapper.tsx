import {NodeViewContent, NodeViewWrapper, ReactNodeViewProps} from '@tiptap/react'
import React from 'react'

export default function CodeBlockWrapper(props: ReactNodeViewProps) {
  const {node} = props
  const [copied, setCopied] = React.useState(false)
  const codeText = node.textContent || ''
  function handleCopy() {
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(codeText).then(() => {
        setCopied(true)
        setTimeout(()=>{
          setCopied(false)
        },2000)
      })
    }else {
      const textarea = document.createElement("textarea");
      textarea.value = codeText;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
      setCopied(true);
      setTimeout(()=>{
        setCopied(false)
      },2000)
    }
  }
  return <NodeViewWrapper>
    <div className='w-full flex justify-end'>
      <button onClick={()=>handleCopy()} className='select-none cursor-pointer opacity-50 transition-opacity duration-300 ease-out hover:opacity-100'>{copied?'Скопировано':'Скопировать'}</button>
    </div>
    <pre>
      <NodeViewContent as='div'/>
    </pre>
  </NodeViewWrapper>
}
