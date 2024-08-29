package fr.nepta.madcoffee.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@RequiredArgsConstructor
@Getter
@Setter
public class UserOrder {

	private User user;

	private Order order;

}
