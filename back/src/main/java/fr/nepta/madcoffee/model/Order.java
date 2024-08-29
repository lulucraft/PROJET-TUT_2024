package fr.nepta.madcoffee.model;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
@Entity
@Table(name = "`order`")
public class Order {

	@Id
//	@TableGenerator(name = "orderGen")//, pkColumnValue = "order_id"
//  @GeneratedValue(strategy = GenerationType.TABLE, generator = "orderGen")
	@Column(name = "order_id")
	private String id;

	@Column(name = "order_date", nullable = false)
	@DateTimeFormat(pattern = "dd-MM-yyyy HH:mm")
	private Date date;

////	@ManyToMany(fetch = FetchType.EAGER)
//	@ElementCollection//(targetClass = ProductQuantity.class)
//	@CollectionTable(joinColumns = @JoinColumn(name = "order_id"))
//	@MapKeyJoinColumn(name = "product_id", referencedColumnName = "id")
////    @MapKeyColumn(name = "product_id")
//	@Column(name = "qty")
//	private Map<Product, Integer> products = new HashMap<>();

	@Column(name = "product_id")
	@ManyToMany(fetch = FetchType.EAGER)
	private Collection<Product> products = new ArrayList<>();

}
