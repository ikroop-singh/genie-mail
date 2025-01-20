package com.mailgenie.mailgenie_writer.Service;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mailgenie.mailgenie_writer.DTO.EmailRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class EmailGeneratorServiceImpl implements EmailGeneratorService {

    @Value("${gemini.api.url}")
    String geminiUrl;

    @Value("${gemini.api.key}")
    String geminiAPIKey;

    WebClient webClient;

    @Autowired
    EmailGeneratorServiceImpl(WebClient.Builder webClient){
        this.webClient=webClient.build();
    }

    public String generateEmailReply(EmailRequest emailRequest){
        String prompt=generatePrompt(emailRequest);

        Map<String,Object[]> requestBody=Map.of("contents",new Object[]{
                Map.of("parts",new Object[]{
                        Map.of("text",prompt)
                })
        });

        String response=webClient.post()
                .uri(geminiUrl+geminiAPIKey)
                .header("content-type","application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();
        return extractResponse(response);
    }
    public String extractResponse(String response){
        try{
            ObjectMapper objectMapper=new ObjectMapper();
            JsonNode rootNode=objectMapper.readTree(response);
            return rootNode.path("candidates").get(0).path("content").path("parts")
                    .get(0).path("text").asText();

        }
        catch(Exception exe){
            return "Exception occurred "+ exe;
        }
    }

    String generatePrompt(EmailRequest emailRequest){
        StringBuilder prompt=new StringBuilder();
        prompt.append("Generate a formal email reply for the following email content without subject line ");
        if(emailRequest.getTone()!=null && !emailRequest.getTone().isEmpty()){
            prompt.append("use a ").append(emailRequest.getTone()).append("tone.");
        }
        prompt.append("\n original email :").append(emailRequest.getContent());
        return prompt.toString();
    }
}
