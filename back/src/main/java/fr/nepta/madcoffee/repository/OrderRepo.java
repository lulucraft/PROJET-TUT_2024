package fr.nepta.madcoffee.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import fr.nepta.madcoffee.model.Order;

public interface OrderRepo extends JpaRepository<Order, Long> {

	Order findById(String orderId);

}
