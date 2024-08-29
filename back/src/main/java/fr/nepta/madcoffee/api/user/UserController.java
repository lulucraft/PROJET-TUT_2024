package fr.nepta.madcoffee.api.user;

import java.io.IOException;
import java.util.Collection;
import java.util.List;

import javax.annotation.security.RolesAllowed;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import fr.nepta.madcoffee.model.Order;
import fr.nepta.madcoffee.model.Product;
import fr.nepta.madcoffee.model.Category;
import fr.nepta.madcoffee.model.User;
import fr.nepta.madcoffee.service.CategoryService;
import fr.nepta.madcoffee.service.OrderService;
import fr.nepta.madcoffee.service.PayPalService;
import fr.nepta.madcoffee.service.ProductService;
import fr.nepta.madcoffee.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:4200/", maxAge = 3600)
@CrossOrigin(origins = {"*"}, maxAge = 4800, allowCredentials = "false", methods = { RequestMethod.GET, RequestMethod.OPTIONS, RequestMethod.POST, RequestMethod.PUT })
@RestController
@RequestMapping("api/user/")
public class UserController {

	@Autowired
	private final UserService us;
	@Autowired
	private final OrderService os;
	@Autowired
	private final ProductService ps;
	@Autowired
	private final CategoryService cs;

	@GetMapping(value = "orders")
	public Collection<Order> getOrders() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		User user = us.getUser(auth.getName());
		return user.getOrders();
	}

	@RolesAllowed("USER")
	@PostMapping(value = "sendorder", consumes = "application/json")
	public void sendOrder(@RequestBody Order order) {
		log.info(order.getId());

		// Order already exists
		if (os.getOrder(order.getId()) != null) {
			log.error("An order with ID {} already exists", order.getId());
			return;
		}

		try {
			order.setProducts(PayPalService.getOrderProducts(order.getId()));
		} catch (IOException | InterruptedException e) {
			e.printStackTrace();
		}

		os.saveOrder(order);

		// // Avoid bypass of admin validation
		// conge.setValidated(false);

		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		// Add order to authenticated user from his username
		us.addOrderToUser(us.getUser(auth.getName()), order);
	}

	@RolesAllowed({"ADMIN", "USER"})
	@GetMapping(value = "products")
	public List<Product> getProducts() {
		return ps.getProducts();
	}

	@RolesAllowed({"ADMIN", "USER"})
	@GetMapping(value = "categories")
	public List<Category> getCategories() {
		return cs.getCategories();
	}

	//	@RolesAllowed("USER")
	//	@PostMapping(value = "deletecongesrequest", consumes = "application/json")
	//	public String deleteCongesRequest(@RequestBody long congeId) throws Exception {
	//		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
	//		us.deleteCongeFromUser(us.getUser(auth.getName()), congeId);
	//		return JSONObject.quote("La demande de congés a été supprimée");
	//	}

	//	@RolesAllowed({"USER","ADMIN"})
	//	@GetMapping(value = "newusers")
	//	public Collection<User> getNewUsers() {
	//		List<User> users = new ArrayList<>();
	//		Calendar currentCal = Calendar.getInstance();
	//		Calendar cal = Calendar.getInstance();
	//
	//		// Get users registered this year
	//		us.getUsers().stream().forEach(u -> {
	//			cal.setTime(u.getCreationDate());
	//			boolean isNewUser = ((currentCal.get(Calendar.YEAR) - cal.get(Calendar.YEAR)) <= 1);
	//			if (isNewUser) {
	//				// Avoid sending password, ...
	//				User us = new User(u.getId(), null, null, null, u.getUsername(), null, u.getCreationDate(), 0, null, null);
	//				users.add(us);
	//			}
	//		});
	//
	//		return users;
	//	}

	//	@GetMapping(value = "newsletters")
	//	public Collection<Newsletter> getNewsletters() {
	//		return ns.getNewsletters();
	//	}
	//
	//	@GetMapping(value = "newsletter")
	//	public Newsletter getNewsletter(@RequestParam String newsletterType) {
	//		return ns.getNewsletter(newsletterType);
	//	}

}
