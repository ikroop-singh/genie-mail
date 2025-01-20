

const findToolBar=()=>{
    const toolbar=document.querySelector(' .btC');
    if(toolbar){
        return toolbar  
    }
    return null;
}

const createAIButton=()=>{
    const button=document.createElement("div");
    button.className="T-I J-J5-Ji aoO v7 T-I-atl L3";
    button.style.marginRight="8px";
    button.style.borderRadius="8px";
    button.style.paddingLeft="18px";
    button.style.paddingRight="18px";
    button.setAttribute('data-tooltip','Generate genie Reply');

    button.innerHTML="Genie Reply";
    return button;
}

const findEmailBody=()=>{      
    
    const content=document.querySelector('.a3s');
    return content.innerText.trim();
}
const injectAIButton=()=>{

    //Remove the existing button if already exist
    // const existButton=document.querySelector('genieButton');
    // if(existButton)
    //         existButton.remove();

    //Find a compose toolbar to inject the button
    const toolbar=findToolBar();

    const genieButton=createAIButton();
    genieButton.classList.add('genieButton');

    
    genieButton.addEventListener("click",async()=>{
        genieButton.innerText="generating..."
        genieButton.disable=true
        try {
            const emailBody=findEmailBody();
                        
            const response=await fetch("http://localhost:8080/api/email/generate",{
                method:"post",
                headers:{
                    'Content-Type':"application/json"
                },
                body:JSON.stringify({
                    "content":emailBody,
                    "tone":"professional"
                })
            })
            const generatedReply = await response.text();
            const composeTextBox = document.querySelector('.Am');
            composeTextBox.focus();
            document.execCommand('insertText',false,generatedReply);     

        } catch (error) {
            console.log(error);
            alert("Error while generating reply")
            
        }
        finally{
            genieButton.innerText="Genie Reply"
            genieButton.disable=true
        }
       
        
        
    })

    toolbar.insertBefore(genieButton,toolbar.firstChild)

    
}


const observer=new MutationObserver((mutations)=>{
    for(const mutation of mutations){
        const addedNodes=Array.from(mutation.addedNodes);
        const hasComposeElements=addedNodes.some(node=>
            node.nodeType===Node.ELEMENT_NODE && 
            (node.matches('.aDh, .btC, [role="dialog"]') || node.querySelector('.aDh, .btC, [role="dialog"]'))
        );        
        if(hasComposeElements){
            console.log("Compose element found");
            setTimeout(injectAIButton,500)            
            break            
        }
    }
    
})
observer.observe(document.body,{
    childList:true,
    subtree:true
})