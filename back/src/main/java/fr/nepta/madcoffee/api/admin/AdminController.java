package fr.nepta.madcoffee.api.admin;

import java.util.Collection;

import javax.annotation.security.RolesAllowed;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import fr.nepta.madcoffee.model.Category;
import fr.nepta.madcoffee.model.Product;
import fr.nepta.madcoffee.model.UserOrder;
import fr.nepta.madcoffee.service.CategoryService;
import fr.nepta.madcoffee.service.OrderService;
import fr.nepta.madcoffee.service.ProductService;
import fr.nepta.madcoffee.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:4200/", maxAge = 3600)
@CrossOrigin(origins = {"*"}, maxAge = 4800, allowCredentials = "false", methods = { RequestMethod.GET, RequestMethod.OPTIONS, RequestMethod.POST, RequestMethod.PUT })
@RestController
@RequestMapping("api/admin/")
public class AdminController {

	@Autowired
	private final UserService us;
	@Autowired
	private final ProductService ps;
	@Autowired
	private final CategoryService cs;
	@Autowired
	private final OrderService os;

	@RolesAllowed("ADMIN")
	@GetMapping(value = "users")
	public String getUsers() {
		return us.getUsers().toString();
	}

	@RolesAllowed("ADMIN")
	@PostMapping(value = "sendproduct", consumes = "application/json")
	public void sendProduct(@RequestBody Product product) {

		// Invalid category label
		if (product.getCategory().getLabel() == null) {
			log.error("The product category cannot be null");
			return;
		}

		// Product already exists
		Product p = ps.getProduct(product.getName());
		if (p != null) {
			log.info("A product with name '{}' already exists... Editing it", product.getName());
			// Set id from database to ensure that product has the good id
			product.setId(p.getId());
			//return;
		}

		Category category = cs.getCategory(product.getCategory().getLabel());
		// Category not found
		if (category == null) {
			log.info("The category '{}' doesn't exists. Adding it in database", product.getCategory().getLabel());
			cs.saveCategory(product.getCategory());
		} else {
			product.setCategory(category);
		}

		ps.saveProduct(product);
	}

	@RolesAllowed("ADMIN")
	@GetMapping(value = "product")
	public Product getProduct(@RequestParam long productId) {
		return ps.getProduct(productId);
	}

	@RolesAllowed("ADMIN")
	@GetMapping(value = "productexists")
	public boolean productExists(@RequestParam String productName) {
		return ps.getProduct(productName) != null;
	}

	@RolesAllowed("ADMIN")
	@GetMapping(value = "orders")
	public Collection<UserOrder> getOrders() {
		return os.getOrders();
	}

//	@RolesAllowed("ADMIN")
//	@PostMapping(value = "editnewsletter")
//	public void editNewsletter(@RequestBody Newsletter newsletter) {
//		Newsletter nl = ns.getNewsletter(newsletter.getType());
//		if (nl != null) {
//			newsletter.setId(nl.getId());
//		}
//		ns.saveNewsletter(newsletter);
//	}

}
