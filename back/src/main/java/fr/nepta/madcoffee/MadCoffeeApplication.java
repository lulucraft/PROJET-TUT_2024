package fr.nepta.madcoffee;

import java.util.ArrayList;
import java.util.Date;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import fr.nepta.madcoffee.model.Order;
import fr.nepta.madcoffee.model.Role;
import fr.nepta.madcoffee.model.User;
import fr.nepta.madcoffee.service.RoleService;
import fr.nepta.madcoffee.service.UserService;

@SpringBootApplication
@EnableJpaRepositories
public class MadCoffeeApplication {

	public static final String SECRET = "E)H@mcQfTjWnZr4u7x!A%D*F-JaNdRgU";

	public static void main(String[] args) {
		SpringApplication.run(MadCoffeeApplication.class, args);
	}

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	CommandLineRunner run(UserService us, RoleService rs) {
		return args -> {
			// ROLES
			if (rs.getRole("USER") == null) {
				rs.saveRole(new Role(null, "USER"));
			}
			if (rs.getRole("ADMIN") == null) {
				rs.saveRole(new Role(null, "ADMIN"));
			}

			if (us.getUser("admin") == null) {
				us.saveUser(new User(null, null, null, "admin@gmail.com", "admin", "root", new Date(), "151 rue de la camionnette", "42000", "Cabino", "France", new ArrayList<Role>(), new ArrayList<Order>()));
			}
			if (!us.getUser("admin").getRoles().contains(rs.getRole("ADMIN"))) {
				us.addRoleToUser("admin", "ADMIN");
			}

			if (us.getUser("user") == null) {
				us.saveUser(new User(null, null, null, "user@gmail.com", "user", "azerty", new Date(), "15 rue de la sibanac", "42000", "Saint-Etienne", "France", new ArrayList<Role>(), new ArrayList<Order>()));
			}
			if (!us.getUser("user").getRoles().contains(rs.getRole("USER"))) {
				us.addRoleToUser("user", "USER");
			}
		};
	}

}
