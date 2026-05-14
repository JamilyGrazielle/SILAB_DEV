package com.ifma.silab;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SilabApplication {

	public static void main(String[] args) {
		SpringApplication.run(SilabApplication.class, args);
	}

}
