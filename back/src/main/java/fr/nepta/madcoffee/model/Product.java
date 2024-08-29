package fr.nepta.madcoffee.model;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
@Entity
@Table(name = "product")
public class Product {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "name")
	private String name;

	@Column(name = "description", columnDefinition = "TEXT")
	private String description;

	@Column(name = "price")
	private double price;

	@Column(name = "refund")
	private double refund;

	@Column(name = "stock")
	private int stockQuantity;

	@Column(name = "brand")
	private String brand;

	@OneToOne(cascade = CascadeType.ALL)
	private Category category;

	@Column(name = "image_link")
	private String imageLink;

}
