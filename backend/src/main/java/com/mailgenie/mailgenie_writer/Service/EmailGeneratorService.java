package com.mailgenie.mailgenie_writer.Service;

import com.mailgenie.mailgenie_writer.DTO.EmailRequest;

public interface EmailGeneratorService {

    public String generateEmailReply(EmailRequest emailRequest);
}
