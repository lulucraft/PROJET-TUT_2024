package fr.nepta.madcoffee.service;

import java.util.Collection;

import fr.nepta.madcoffee.model.Order;
import fr.nepta.madcoffee.model.UserOrder;

public interface OrderService {

	Order saveOrder(Order order);

	Order getOrder(String orderId);

	Collection<UserOrder> getOrders();

}
