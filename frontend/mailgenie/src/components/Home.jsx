import React, { useEffect, useState } from 'react'
import useGenerateReply from '../utils/useGenerateReply';
import toast from 'react-hot-toast';

const Home = () => {
  const [content, setContent] = useState('');
  const [tone, setTone] = useState(null);
  const [loading, generateReply, result, setResult,error] = useGenerateReply();


  const handleClick = async () => {

    await generateReply({ content, tone });
  }

  const handleClipboard=()=>{
    navigator.clipboard.writeText(result);
    toast.success("Copied to clipboard")
  }

  return (
    <div className="container">
      <h1>GenieMail</h1>
      <div className='textfield-div'>
        <textarea onChange={(e) => setContent(e.target.value)} id="content" placeholder="Paste the email body here..."></textarea>
      </div>

      {
        result!=null
        &&
        <div className='textfield-div'>

          <div className='d-flex'>
          <p className='para'>Genie Reply:</p>
          <button className='clipboard' onClick={handleClipboard}>Copy to clipboard</button>

          </div>
          <textarea onChange={(e)=>setResult(e.target.value)}  id="output" className="output" value={result}></textarea>
        </div>
      }

      <select id="tone" className="dropdown" onChange={(e) => setTone(e.target.value)} >
        <option value="" disabled selected>Select Tone</option>
        <option value="formal">Formal</option>
        <option value="informal">Informal</option>
        <option value="friendly">Friendly</option>
        <option value="concise">Concise</option>
        <option value="apologetic">Apologetic</option>
        <option value="persuasive">Persuasive</option>
      </select>
      {
        !loading
          ?
          <button className='generate' disabled={content.trim().length === 0 ? true : false} onClick={handleClick}>Generate Reply</button>
          :
          <button className='generate'  >Generating...</button>
      }

      <div className="footer">
        Powered by GenieMail | Smart Reply Automation
      </div>
    </div>
  )
}

export default Home