USE amigosdejesus;


CREATE TABLE tblRole (
	RoleId INT auto_increment primary key NOT NULL,
	Description varchar(125) NOT NULL,
	Status INT NOT NULL,
	CreatedDate DATETIME NOT NULL,
	CreatedBy INT NOT NULL,
	UpdatedDate DATETIME NOT NULL,
	UpdatedBy INT NOT NULL
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

SELECT * FROM tblRole;


CREATE TABLE tblPermission (

	PermissionId INT auto_increment primary key NOT NULL,
	title varchar(125) NOT NULL,
	Description varchar(255) NOT NULL,
	Status INT NOT NULL,
	CreatedDate DATETIME NOT NULL,
	CreatedBy INT NOT NULL,
	UpdatedDate DATETIME NOT NULL,
	UpdatedBy INT NOT NULL
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

SELECT * FROM tblPermission;


CREATE TABLE tblRolePermission (

	RoleId INT NOT NULL,
	PermissionId INT NOT NULL,
	Status INT NULL,
	CreatedDate DATETIME NOT NULL,
	CreatedBy INT NOT NULL,
	UpdatedDate DATETIME NOT NULL,
	UpdatedBy INT NOT NULL,
	PRIMARY KEY (roleId, permissionId),
  	CONSTRAINT `fk_rp_role`
    FOREIGN KEY (roleId)
    REFERENCES tblRole(RoleId),
  	CONSTRAINT `fk_rp_permission`
    FOREIGN KEY (permissionId)
    REFERENCES tblPermission(PermissionId)
    
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

SELECT * FROM tblRolePermission;


CREATE TABLE tblUser (

	UserId INT auto_increment primary key NOT NULL,
	Roleid INT NULL,
	UserName varchar(125) NOT NULL,
	UserPassword varchar(125) NOT NULL, 
	Email varchar(255) NOT NULL,
	FirstName varchar(255) NOT NULL,
	LastName varchar(255) NOT NULL,
	DateOfBirth DATE NOT NULL,
	Status INT NOT NULL,
	CreatedDate DATETIME NOT NULL,
	CreatedBy INT NOT NULL,
	UpdatedDate DATETIME NOT NULL,
	UpdatedBy INT NOT NULL,
	CONSTRAINT `fk_user_role`
    FOREIGN KEY (RoleId)
    REFERENCES tblRole(RoleId)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

SELECT * FROM tblUser;




CREATE TABLE tblAddress (

	AddressId INT auto_increment primary key NOT NULL,
	Latitude decimal(20,10) NOT NULL,
	Longitude decimal(20,10) NOT NULL, 
	City varchar(255) NOT NULL,
	District varchar(255) NOT NULL,
	Street varchar(255) NOT NULL,
	Status INT NOT NULL,
	UserId INT NOT NULL,
	CreatedDate DATETIME NOT NULL,
	CreatedBy INT NOT NULL,
	UpdatedDate DATETIME NOT NULL,
	UpdatedBy INT NOT NULL,
	CONSTRAINT `fk_address_user`
    FOREIGN KEY (UserId)
    REFERENCES tblUser(UserId)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

SELECT * FROM tblAddress;


CREATE TABLE tblOrderStatus (

	OrderStatusId INT auto_increment primary key NOT NULL,
	Description varchar(255) NOT NULL,
	Status INT NOT NULL,
	CreatedDate DATETIME NOT NULL,
	CreatedBy INT NOT NULL,
	UpdatedDate DATETIME NOT NULL,
	UpdatedBy INT NOT NULL
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

SELECT * FROM tblOrderStatus;

CREATE TABLE tblOrder (

	OrderId INT auto_increment primary key NOT NULL,
	OrderStatusId INT NOT NULL, 
	CustomerId INT NOT NULL,
	AdminUserId INT NOT NULL, 
	Description varchar(255) NOT NULL,
	CreatedDate DATETIME NOT NULL,
	CreatedBy INT NOT NULL,
	UpdatedDate DATETIME NOT NULL,
	UpdatedBy INT NOT NULL,
	CONSTRAINT `fk_order_os`
    FOREIGN KEY (OrderStatusId)
    REFERENCES tblOrderStatus (OrderStatusId)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

SELECT * FROM tblOrder;

CREATE TABLE tblCategory (

	CategoryId INT auto_increment primary key NOT NULL,
	Description varchar(255) NOT NULL,
	Status varchar(255) NOT NULL,
	CreatedDate DATETIME NOT NULL,
	CreatedBy INT NOT NULL,
	UpdatedDate DATETIME NOT NULL,
	UpdatedBy INT NOT NULL
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;


SELECT * FROM tblCategory;


CREATE TABLE tblSubCategory (

	SubCategoryId INT auto_increment primary key NOT NULL,
	CategoryId INT, 
	Description varchar(255) NOT NULL,
	Status varchar(255) NOT NULL,
	CreatedDate DATETIME NOT NULL,
	CreatedBy INT NOT NULL,
	UpdatedDate DATETIME NOT NULL,
	UpdatedBy INT NOT NULL,
	CONSTRAINT `fk_subcategory_category`
    FOREIGN KEY (CategoryId)
    REFERENCES tblCategory(CategoryId)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

SELECT * FROM tblSubCategory;


CREATE TABLE tblDiscount (

	DiscountId INT auto_increment primary key NOT NULL,
	Description varchar(255) NOT NULL,
	DiscountAmount DECIMAL(10,6),
	Status varchar(255) NOT NULL,
	CreatedDate DATETIME NOT NULL,
	CreatedBy INT NOT NULL,
	UpdatedDate DATETIME NOT NULL,
	UpdatedBy INT NOT NULL
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

SELECT * FROM tblDiscount;


CREATE TABLE tblProduct (

	ProductId INT auto_increment primary key NOT NULL,
	SubCategoryId INT NOT NULL,
	DiscountId INT NOT NULL, 
	StockKeepingUnit bigint NOT NULL,
	Name varchar(255)NOT NULL,
	Description varchar(255) NOT NULL,
	Status INT NOT NULL,
	Price decimal(15,10) NOT NULL,
	CreatedDate DATETIME NOT NULL,
	CreatedBy INT NOT NULL,
	UpdatedDate DATETIME NOT NULL,
	UpdatedBy INT NOT NULL,
	CONSTRAINT `fk__product_subcategory`
    FOREIGN KEY (SubCategoryId)
    REFERENCES tblSubCategory(SubCategoryId)
	
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

SELECT * FROM tblProduct;

CREATE TABLE tblInventory (

	InventoryId INT auto_increment primary key NOT NULL,
	ProductId INT NOT NULL,
	Description varchar(255) NOT NULL,
	Quantity INT NOT NULL,
	Status varchar(255) NOT NULL,
	CreatedDate DATETIME NOT NULL,
	CreatedBy INT NOT NULL,
	UpdatedDate DATETIME NOT NULL,
	UpdatedBy INT NOT NULL,
	CONSTRAINT `fk_inventory_product`
    FOREIGN KEY (ProductId)
    REFERENCES tblProduct(ProductId)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

SELECT * FROM tblInventory;



CREATE TABLE tblOrderDetail (

	OrderDetailId INT auto_increment primary key NOT NULL,
	OrderId INT NOT NULL, 
	Quantity INT NOT NULL,
	PricePerUnit decimal(15,10) NOT NULL, 
	CreatedDate DATETIME NOT NULL,
	CreatedBy INT NOT NULL,
	UpdatedDate DATETIME NOT NULL,
	UpdatedBy INT NOT NULL,
	CONSTRAINT `fk_od_order`
    FOREIGN KEY (OrderId)
    REFERENCES tblOrder(OrderId)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

SELECT * FROM tblOrderDetail;


CREATE TABLE tblOrderItem (

	OrderItemId INT auto_increment primary key NOT NULL,
	ProductId INT NOT NULL, 
	OrderDetailId INT NOT NULL, 
	CreatedDate DATETIME NOT NULL,
	CreatedBy INT NOT NULL,
	UpdatedDate DATETIME NOT NULL,
	UpdatedBy INT NOT NULL,
	CONSTRAINT `fk_oi_product`
    FOREIGN KEY (ProductId)
    REFERENCES tblProduct(ProductId),
    CONSTRAINT `fk_oi_od`
    FOREIGN KEY (OrderDetailId)
    REFERENCES tblOrderDetail(OrderDetailId)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

SELECT * FROM tblOrderItem;



