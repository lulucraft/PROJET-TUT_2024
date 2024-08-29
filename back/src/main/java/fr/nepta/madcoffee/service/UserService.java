package fr.nepta.madcoffee.service;

import java.util.List;

import fr.nepta.madcoffee.model.Order;
import fr.nepta.madcoffee.model.Role;
import fr.nepta.madcoffee.model.User;

public interface UserService {

	User saveUser(User user);

	void addRoleToUser(User user, Role role);

	void addRoleToUser(String username, String roleName);

	User getUser(String username);

	List<User> getUsers();

	void addOrderToUser(User user, Order order);

//	void addCongeToUser(User user, Conge conge);

//	void deleteCongeFromUser(User user, long congeId) throws Exception;

}
