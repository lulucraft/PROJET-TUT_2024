package fr.nepta.madcoffee.service.impl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fr.nepta.madcoffee.model.Order;
import fr.nepta.madcoffee.model.Role;
import fr.nepta.madcoffee.model.User;
import fr.nepta.madcoffee.repository.RoleRepo;
import fr.nepta.madcoffee.repository.UserRepo;
import fr.nepta.madcoffee.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor @Slf4j
@Transactional
public class UserServiceImpl implements UserService, UserDetailsService {

	private final UserRepo userRepo;
	private final RoleRepo roleRepo;
	private final PasswordEncoder passEncoder;

	@Override
	public User saveUser(User user) {
		log.info("Saving new user to the database");
		user.setPassword(passEncoder.encode(user.getPassword()));
		return userRepo.save(user);
	}

	@Override
	public void addRoleToUser(User user, Role role) {
		user.getRoles().add(role);
		userRepo.save(user);
		log.info("Role '{}' added to user '{}'", role.getName(), user.getUsername());
	}

	@Override
	public void addRoleToUser(String username, String roleName) {
		addRoleToUser(userRepo.findByUsername(username), roleRepo.findByName(roleName));
	}

	@Override
	public User getUser(String username) {
		log.info("Fetching user '{}' from database", username);
		return userRepo.findByUsername(username);
	}

	@Override
	public List<User> getUsers() {
		log.info("Fetching all users");
		return userRepo.findAll();
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User u = userRepo.findByUsername(username);

		if (u == null) {
			log.error("User '{}' not found in the database", username);
			throw new UsernameNotFoundException("User not found in the database");
		}

		Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
		u.getRoles().forEach(r -> {
			authorities.add(new SimpleGrantedAuthority(r.getName()));
		});

		return new org.springframework.security.core.userdetails.User(u.getUsername(), u.getPassword(), authorities);
	}

	@Override
	public void addOrderToUser(User user, Order order) {
		user.getOrders().add(order);
		userRepo.save(user);
		log.info("Order '{}' added to user '{}'", order.getId(), user.getUsername());
	}

//	@Override
//	public void addCongeToUser(User user, Conge conge) {
//		user.getConges().add(conge);
//		congeRepo.save(conge);
//		log.info("Conge '{}' added to user '{}'", conge.getId(), user.getUsername());
//	}

//	@Override
//	public void deleteCongeFromUser(User user, long congeId) throws Exception {
//		Conge conge = congeRepo.findById(congeId);
//
//		if (conge == null) {
//			throw new Exception("Aucune demande de congés trouvée avec l'id " + congeId);
//		}
//
//		if (conge.getValidator() != null) {
//			throw new Exception("Impossible de supprimer le congé '" + congeId + "' (déjà validé).");
//		}
//
//		user.getConges().remove(conge);
//		congeRepo.delete(conge);
//		userRepo.save(user);
//
//		log.info("Conge request '{}' deleted", congeId);
//	}

}
