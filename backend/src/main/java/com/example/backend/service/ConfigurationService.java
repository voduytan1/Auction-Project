package com.example.backend.service;

import com.example.backend.dto.admin.config.CreateConfigRequest;
import com.example.backend.entity.ConfigVariable;
import com.example.backend.entity.Configuration;
import com.example.backend.repository.ConfigurationRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ConfigurationService {
    private final ConfigurationRepository configurationRepository;

    public ConfigurationService(ConfigurationRepository configurationRepository) {
        this.configurationRepository = configurationRepository;
    }

    @Transactional
    public Configuration setConfigurationVariable(CreateConfigRequest request){
        Optional<Configuration> config = configurationRepository.findByVariable(request.getVariable());
        if(config. isEmpty()){
            Configuration temp = Configuration.builder()
                    .variable(request.getVariable())
                    .value(request.getValue())
                    .build();
            return configurationRepository.save(temp);
        }else{
            if(request.getValue().equals(config.get().getValue())){
                return config.get();
            }
            else{
                config.get().setValue(request.getValue());
                return configurationRepository.save(config.get());
            }
        }
    }

    public Configuration getConfigurationVariable(ConfigVariable variable){
        return configurationRepository.findByVariable(variable).orElseThrow(()-> new RuntimeException("Không tìm thấy biến config"));
    }
}
