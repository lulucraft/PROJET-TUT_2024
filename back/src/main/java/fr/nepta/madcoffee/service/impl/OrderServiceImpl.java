package fr.nepta.madcoffee.service.impl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fr.nepta.madcoffee.model.Order;
import fr.nepta.madcoffee.model.User;
import fr.nepta.madcoffee.model.UserOrder;
import fr.nepta.madcoffee.repository.OrderRepo;
import fr.nepta.madcoffee.repository.UserRepo;
import fr.nepta.madcoffee.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor @Slf4j
@Transactional
public class OrderServiceImpl implements OrderService {

	private final OrderRepo orderRepo;
	private final UserRepo userRepo;

	@Override
	public Order saveOrder(Order order) {
		log.info("Saving new order in the database");
		return orderRepo.save(order);
	}

	@Override
	public Order getOrder(String orderId) {
		log.info("Fetching order '{}'", orderId);
		return orderRepo.findById(orderId);
	}

	@Override
	public Collection<UserOrder> getOrders() {
		log.info("Fetching all orders");
		List<UserOrder> usersOrders = new ArrayList<>();

		for (Order order : orderRepo.findAll()) {
			User u = userRepo.findByOrdersId(order.getId());
			if (u != null) {
				UserOrder uo = new UserOrder();
				uo.setUser(u);
				uo.setOrder(order);
				usersOrders.add(uo);
			}
		}

		return usersOrders;
	}

}
