package dev.woori.WooriServer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

@SpringBootApplication
@EnableFeignClients
public class WooriServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(WooriServerApplication.class, args);
	}

}
