import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";

import categoriesData from "../../category.js";
import prodactData from "../../products.js";

const ProductInfo = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [gridView, setGridView] = useState("3");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0); // dynamic later

  // ✅ Load categories & products on mount
  useEffect(() => {
    setCategories(categoriesData);
    setProducts(prodactData);
    setFilteredProducts(prodactData);

    // Calculate dynamic price range based on product data
    const prices = products.map((p) =>
      Number(p.newPrice.replace(/[^\d.-]/g, ""))
    );
    const min = Math.min(...prices);
    const max = Math.max(...prices);

    setMinPrice(min);
    setMaxPrice(max);
  }, [products]);

  // ✅ Handle grid view change
  const handleGridChange = (view) => {
    setGridView(view);
  };

  // ✅ Category Filter
  const handleCategoryChange = (categoryTitle) => {
    if (categoryTitle === "All") {
      setSelectedCategories([]);
      return;
    }
    setSelectedCategories([categoryTitle]);
  };

  // ✅ Brand Filter
  const handleBrandChange = (brand) => {
    if (brand === "All") {
      setSelectedBrand("All");
      return;
    }
    setSelectedBrand(brand);
  };

  // ✅ Price Filter Change
  const handlePriceChange = (e, type) => {
    const value = Number(e.target.value);
    if (type === "min") setMinPrice(value);
    else setMaxPrice(value);
  };

  // ✅ Extract all unique brands
  const uniqueBrands = ["All", ...new Set(prodactData.map((p) => p.brand))];

  // ✅ Main Filtering Logic
  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) => p.category === selectedCategories[0]);
    }

    // Filter by brand
    if (selectedBrand !== "All") {
      filtered = filtered.filter((p) => p.brand === selectedBrand);
    }

    // Filter by price
    filtered = filtered.filter((p) => {
      const price = Number(p.newPrice.replace(/[^\d.-]/g, ""));
      return price >= minPrice && price <= maxPrice;
    });

    setFilteredProducts(filtered);
  }, [selectedCategories, selectedBrand, minPrice, maxPrice, products]);

  // ✅ Dynamic highest product price (for UI display)
  const highestPrice = Math.max(
    ...products.map((p) => Number(p.newPrice.replace(/[^\d.-]/g, "")))
  );

  // ✅ Sort Function
  const handleSortChange = (value) => {
    let sorted = [...filteredProducts];

    switch (value) {
      case "title-ascending":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-descending":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "price-ascending":
        sorted.sort(
          (a, b) =>
            parseFloat(a.newPrice.replace(/[^\d.-]/g, "")) -
            parseFloat(b.newPrice.replace(/[^\d.-]/g, ""))
        );
        break;
      case "price-descending":
        sorted.sort(
          (a, b) =>
            parseFloat(b.newPrice.replace(/[^\d.-]/g, "")) -
            parseFloat(a.newPrice.replace(/[^\d.-]/g, ""))
        );
        break;
      case "best-selling":
        sorted.sort((a, b) => b.sales - a.sales); // optional if your data has sales count
        break;
      default:
        sorted = [...products];
    }

    setFilteredProducts(sorted);
  };

  // Open modal with body scroll handling
  const openModal = (modalId) => {
    const modalEl = document.getElementById(modalId);

    if (modalEl && window.bootstrap) {
      const modalInstance = window.bootstrap.Modal.getOrCreateInstance(
        modalEl,
        {
          backdrop: true,
          keyboard: true,
        }
      );

      // 🟢 Ensure modal is reset before showing again
      modalEl.style.display = "block";
      modalEl.removeAttribute("aria-hidden");
      modalEl.setAttribute("aria-modal", "true");
      modalEl.setAttribute("role", "dialog");

      modalInstance.show();
    }
  };

  return (
    <section className="main-content-wrap bg-color shop-page section-ptb">
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="pro-grli-wrapper left-side-wrap">
              <div className="pro-grli-wrap product-grid">
                <div className="collection-img-wrap">
                  <h6 className="st-title">
                    Total Product ({filteredProducts.length})
                  </h6>

                  <div className="collection-info">
                    <div className="collection-image">
                      <img
                        src="/img/banner/sall-banner.jpg"
                        className="img-fluid"
                        alt="sall-banner"
                      />
                    </div>
                  </div>
                </div>
                {/* <!-- shop-top-bar start --> */}
                <div className="shop-top-bar wow">
                  <div className="product-filter without-sidebar">
                    <button className="filter-button" type="button">
                      <i className="fa-solid fa-filter"></i>
                      <span>Filter</span>
                    </button>
                  </div>
                  <div className="product-view-mode">
                    {/* <!-- shop-item-filter-list start --> */}
                    <Link
                      to="#"
                      className={`list-change-view grid-three ${
                        gridView === "3" ? "active" : ""
                      }`}
                      data-grid-view="3"
                      onClick={() => handleGridChange("3")}
                    >
                      <i className="fa-solid fa-border-all"></i>
                    </Link>
                    <Link
                      to="#"
                      data-grid-view="1"
                      className={`list-change-view list-one ${
                        gridView === "1" ? "active" : ""
                      }`}
                      onClick={() => handleGridChange("1")}
                    >
                      <i className="fa-solid fa-list"></i>
                    </Link>
                  </div>
                  {/* <!-- product-short start --> */}
                  <div className="product-short">
                    <label htmlFor="SortBy">Sort by:</label>

                    <Link to="#" className="short-title">
                      <span className="sort-title">Best Selling</span>
                      <span className="sort-icon">
                        <i className="bi bi-chevron-down"></i>
                      </span>
                    </Link>
                    <Link to="#" className="short-title short-title-lg">
                      <span className="sort-title">Best Selling</span>
                      <span className="sort-icon">
                        <i className="bi bi-chevron-down"></i>
                      </span>
                    </Link>

                    <ul className="pro-ul collapse">
                      <li className="pro-li">
                        <Link to="#" onClick={() => handleSortChange("manual")}>
                          Featured
                        </Link>
                      </li>
                      <li className="pro-li">
                        <Link
                          to="#"
                          onClick={() => handleSortChange("best-selling")}
                        >
                          Best Selling
                        </Link>
                      </li>
                      <li className="pro-li">
                        <Link
                          to="#"
                          onClick={() => handleSortChange("title-ascending")}
                        >
                          Alphabetically, A-Z
                        </Link>
                      </li>
                      <li className="pro-li">
                        <Link
                          to="#"
                          onClick={() => handleSortChange("title-descending")}
                        >
                          Alphabetically, Z-A
                        </Link>
                      </li>
                      <li className="pro-li">
                        <Link
                          to="#"
                          onClick={() => handleSortChange("price-ascending")}
                        >
                          Price, low to high
                        </Link>
                      </li>
                      <li className="pro-li">
                        <Link
                          to="#"
                          onClick={() => handleSortChange("price-descending")}
                        >
                          Price, high to low
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className={`special-product grid-${gridView}`}>
                  <div className="collection-category">
                    <div className="row">
                      <div className="col">
                        <div className="collection-wrap">
                          <ul className="product-view-ul">
                            {filteredProducts.length > 0 ? (
                              filteredProducts.map((product) => (
                                <li
                                  key={product.id}
                                  className="pro-item-li coll-li"
                                >
                                  <div className="single-product-wrap">
                                    <div className="product-image banner-hover">
                                      <Link
                                        // to="/product-details"
                                        to={`/product-details/${product.id}`}
                                        // to={`/product-details/${product.id}`}
                                        className="pro-img"
                                      >
                                        <img
                                          src={product.img1}
                                          className="img-fluid img1 mobile-img1"
                                          alt={product.title}
                                        />
                                        <img
                                          src={product.img2}
                                          className="img-fluid img2 mobile-img2"
                                          alt={product.title}
                                        />
                                      </Link>

                                      <div className="product-action">
                                        <Link
                                          className="quickview"
                                          onClick={() => openModal("quickview")}
                                        >
                                          <span className="tooltip-text">
                                            Quickview
                                          </span>
                                          <span className="pro-action-icon">
                                            <i className="feather-eye"></i>
                                          </span>
                                        </Link>
                                        <Link
                                          to="#add-to-cart"
                                          className="add-to-cart"
                                        >
                                          <span className="tooltip-text">
                                            Add to cart
                                          </span>
                                          <span className="pro-action-icon">
                                            <i className="feather-shopping-bag"></i>
                                          </span>
                                        </Link>
                                        <Link
                                          to="/wishlist-product"
                                          className="wishlist"
                                        >
                                          <span className="tooltip-text">
                                            Wishlist
                                          </span>
                                          <span className="pro-action-icon">
                                            <i className="feather-heart"></i>
                                          </span>
                                        </Link>
                                      </div>
                                    </div>

                                    <div className="product-caption">
                                      <div className="product-content">
                                        <div className="product-sub-title">
                                          <span>{product.subtitle}</span>
                                        </div>
                                        <div className="product-title">
                                          <h6>
                                            <Link
                                              to={`/product-details/${product.id}`}
                                            >
                                              {product.title}
                                            </Link>
                                          </h6>
                                        </div>
                                        <div className="product-price">
                                          <div className="pro-price-box">
                                            <span className="new-price">
                                              {product.newPrice}
                                            </span>
                                            <span className="old-price">
                                              {product.oldPrice}
                                            </span>
                                          </div>
                                        </div>
                                        <div className="product-description">
                                          <p>{product.description}</p>
                                        </div>
                                      </div>

                                      <div className="pro-label-retting">
                                        <div className="product-ratting">
                                          <span className="pro-ratting">
                                            {Array.from({
                                              length: product.rating,
                                            }).map((_, i) => (
                                              <i
                                                key={i}
                                                className="fa-solid fa-star"
                                              ></i>
                                            ))}
                                          </span>
                                        </div>
                                        <div className="product-label pro-new-sale">
                                          <span className="product-label-title">
                                            Sale<span>{product.sale}</span>
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))
                            ) : (
                              <p>No products found.</p>
                            )}
                          </ul>
                        </div>

                        <div className="paginatoin-area">
                          <ul className="pagination-page-box">
                            <li className="number active">
                              <Link to="#" className="theme-glink">
                                1
                              </Link>
                            </li>
                            <li className="number">
                              <Link to="#" className="gradient-text">
                                2
                              </Link>
                            </li>
                            <li className="page-next">
                              <Link to="#" className="theme-glink">
                                <i className="fa -solid fa-angle-right"></i>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pro-grli-wrap product-sidebar">
                <div className="pro-grid-block">
                  <div className="shop-sidebar-inner">
                    <div className="shop-sidebar-wrap filter-sidebar">
                      {/* <!-- button start --> */}
                      <button className="close-sidebar" type="button">
                        <i className="fa-solid fa-xmark"></i>
                      </button>

                      {/* <!-- filter-form start --> */}
                      <div className="facets">
                        <form className="facets-form">
                          <div className="facets-wrapper">
                            {/* <!-- Product-Categories start --> */}
                            <div className="shop-sidebar">
                              <h6 className="shop-title">Categories</h6>
                              <Link
                                to="#collapse-5"
                                data-bs-toggle="collapse"
                                className="shop-title shop-title-lg"
                              >
                                Categories<i className="fa fa-angle-down"></i>
                              </Link>

                              <div
                                className="collapse show shop-element"
                                id="collapse-5"
                              >
                                <ul className="brand-ul scrollbar">
                                  <li className="cat-checkbox">
                                    <label className="checkbox-label">
                                      <input
                                        type="checkbox"
                                        className="cust-checkbox"
                                        checked={
                                          selectedCategories.length === 0
                                        }
                                        onChange={() =>
                                          handleCategoryChange("All")
                                        }
                                      />
                                      <span className="check-name">All</span>
                                      <span className="count-check">
                                        ({products.length})
                                      </span>
                                      <span className="cust-check"></span>
                                    </label>
                                  </li>

                                  {/* ✅ Dynamic categories with real product counts */}
                                  {categories.map((category) => {
                                    const categoryCount = products.filter(
                                      (p) => p.category === category.title
                                    ).length;

                                    return (
                                      <li
                                        key={category.id}
                                        className="cat-checkbox"
                                      >
                                        <label className="checkbox-label">
                                          <input
                                            type="checkbox"
                                            className="cust-checkbox"
                                            checked={
                                              selectedCategories[0] ===
                                              category.title
                                            }
                                            onChange={() =>
                                              handleCategoryChange(
                                                category.title
                                              )
                                            }
                                          />
                                          <span className="check-name">
                                            {category.title}
                                          </span>
                                          <span className="count-check">
                                            ({categoryCount})
                                          </span>
                                          <span className="cust-check"></span>
                                        </label>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            </div>

                            <div className="shop-sidebar sidebar-filter">
                              <h6 className="shop-title">Filter</h6>
                              <Link to="#" className="shop-title shop-title-lg">
                                Filter
                              </Link>
                              <div className="filter-info">
                                <span className="filter-count-text">
                                  23 products
                                </span>
                                <span className="loading-spinner">
                                  <FaSpinner className="spinner-icon" />
                                </span>
                              </div>
                            </div>

                            <div className="shop-sidebar sidebar-price">
                              <h6 className="shop-title">Price</h6>
                              <Link
                                to="#collapse-3"
                                data-bs-toggle="collapse"
                                className="shop-title shop-title-lg"
                              >
                                Price
                              </Link>
                              <div className="filter-info">
                                <span className="shop-price">
                                  The highest price is ৳{" "}
                                  {highestPrice.toLocaleString()}
                                </span>
                                <facet-remove>
                                  <Link
                                    to="#"
                                    className="reset-text"
                                    onClick={() => {
                                      const prices = products.map((p) =>
                                        Number(
                                          p.newPrice.replace(/[^\d.-]/g, "")
                                        )
                                      );
                                      setMinPrice(Math.min(...prices));
                                      setMaxPrice(Math.max(...prices));
                                      setSelectedCategories([]);
                                      setSelectedBrand("All");
                                      setFilteredProducts(products);
                                    }}
                                  >
                                    Reset
                                  </Link>
                                </facet-remove>
                              </div>

                              <div
                                className="collapse price-wrap"
                                id="collapse-3"
                              >
                                <price-range className="price-range">
                                  <div className="price-range-group group-range">
                                    <input
                                      type="range"
                                      className="range"
                                      min="0"
                                      max={highestPrice}
                                      value={minPrice}
                                      onChange={(e) =>
                                        handlePriceChange(e, "min")
                                      }
                                    />
                                    <input
                                      type="range"
                                      className="range"
                                      min="0"
                                      max={highestPrice}
                                      value={maxPrice}
                                      onChange={(e) =>
                                        handlePriceChange(e, "max")
                                      }
                                    />
                                  </div>

                                  <div className="price-input-group group-input">
                                    <div className="price-range-input input-price">
                                      <label className="label-text">From</label>
                                      <span className="price-value">৳</span>
                                      <span id="demo1" className="price-field">
                                        {minPrice}
                                      </span>
                                    </div>
                                    <span className="price-range-delimeter">
                                      -
                                    </span>
                                    <div className="price-range-input input-price">
                                      <label className="label-text">To</label>
                                      <span className="price-value">৳</span>
                                      <span id="demo2" className="price-field">
                                        {maxPrice}
                                      </span>
                                    </div>
                                  </div>
                                </price-range>
                              </div>
                            </div>

                            <div className="shop-sidebar sidebar-wedget">
                              <h6 className="shop-title">Availability</h6>
                              <Link
                                to="#collapse-1"
                                className="shop-title shop-title-lg"
                                data-bs-toggle="collapse"
                              >
                                Availability
                              </Link>
                              <div className="filter-info">
                                <span className="shop-price no-js-hidden">
                                  0 selected
                                </span>
                                <facet-remove>
                                  <Link to="/product" className="reset-text">
                                    Reset
                                  </Link>
                                </facet-remove>
                              </div>
                              <div
                                className="collapse filter-element"
                                id="collapse-1"
                              >
                                <ul className="brnad-ul scrollbar">
                                  <li className="availability">
                                    <label className="cust-checkbox-label availability in-stock">
                                      <input
                                        type="checkbox"
                                        name="filter.v.availability"
                                        value="1"
                                        className="cust-checkbox"
                                      />
                                      <span className="filter-name">
                                        In stock
                                      </span>
                                      <span className="count-check">(23)</span>
                                      <span className="cust-check"></span>
                                    </label>
                                  </li>
                                  <li className="availability">
                                    <label className="cust-checkbox-label availability in-stock">
                                      <input
                                        type="checkbox"
                                        name="filter.v.availability"
                                        value="1"
                                        className="cust-checkbox"
                                      />
                                      <span className="filter-name">
                                        Out of stock
                                      </span>
                                      <span className="count-check">(1)</span>
                                      <span className="cust-check"></span>
                                    </label>
                                  </li>
                                </ul>
                              </div>
                            </div>

                            <div className="shop-sidebar sidebar-wedget">
                              <h6 className="shop-title">Brand</h6>
                              <div className="filter-info">
                                <span className="shop-price">
                                  {selectedBrand === "All"
                                    ? "All selected"
                                    : selectedBrand}
                                </span>
                                <Link
                                  to="#"
                                  className="reset-text"
                                  onClick={() => setSelectedBrand("All")}
                                >
                                  Reset
                                </Link>
                              </div>
                              <div
                                className="collapse filter-element"
                                id="reset"
                              >
                                <ul className="brand-ul scrollbar">
                                  {uniqueBrands.map((brand, i) => (
                                    <li className="brand-li" key={i}>
                                      <label className="cust-checkbox-label">
                                        <input
                                          type="checkbox"
                                          className="cust-checkbox"
                                          checked={selectedBrand === brand}
                                          onChange={() =>
                                            handleBrandChange(brand)
                                          }
                                        />
                                        <span className="filter-name">
                                          {brand}
                                        </span>
                                        <span className="count-check">
                                          (
                                          {products.filter(
                                            (p) => p.brand === brand
                                          ).length || products.length}
                                          )
                                        </span>
                                        <span className="cust-check"></span>
                                      </label>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  {/* <!-- sidebar img start --> */}
                  <div className="sidebar-banner banner-hover">
                    <Link to="/product" className="sidebar-img banner-img">
                      <span className="sidebar-banner-image">
                        <img
                          src="/img/banner/side-banner.jpg"
                          className="img-fluid"
                          alt="side-banner"
                        />
                      </span>
                      <span className="sidebar-banner-icon">
                        <i className="bi bi-arrow-right-short"></i>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductInfo;
