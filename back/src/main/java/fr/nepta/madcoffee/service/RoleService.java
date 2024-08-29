package fr.nepta.madcoffee.service;

import fr.nepta.madcoffee.model.Role;

public interface RoleService {

	Role saveRole(Role role);

	Role getRole(String roleName);

}
