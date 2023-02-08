import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const { categoryId } = product;
  const category = categoriesFromServer.find(
    ({ id }) => categoryId === id,
  ) || null;
  const user = usersFromServer.find(
    ({ id }) => id === category.ownerId,
  ) || null;

  return { ...product, category, user };
});

export const App = () => {
  const [selectedUser, setSelectedUser] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [selectedProducts, setSelectedProducts] = useState(products);
  const visibleProducts = selectedProducts.filter(({ name }) => {
    const preparedInput = inputValue.toLowerCase();

    return name.toLowerCase().includes(preparedInput);
  });

  const filterByUser = (userId) => {
    if (userId === 0) {
      return products;
    }

    return selectedProducts.filter(({ user }) => userId === user.id);
  };

  // const filterByCategory = (categoryId) => {
  //   if (categoryId === 0) {
  //     return products;
  //   }

  //   return selectedProducts.filter(
  //     ({ category }) => categoryId === category.id,
  //   );
  // };

  const handleSelectedUser = (event) => {
    setSelectedUser(+event.target.id);
    setSelectedProducts(filterByUser(+event.target.id));
  };

  // const handleSelectedCategory = (event) => {
  //   setSelectedProducts(filterByCategory(+event.target.id));
  // };

  const handleInputValue = (event) => {
    setInputValue(event.target.value);
  };

  const isSelectedUser = userId => selectedUser === userId;

  const resetFilters = () => {
    setInputValue('');
    setSelectedUser(0);
    setSelectedProducts(products);
  };

  // eslint-disable-next-line no-console
  // console.log(inputValue);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={handleSelectedUser}
                className={cn({ 'is-active': isSelectedUser(0) })}
                id={0}
              >
                All
              </a>

              {usersFromServer.map(({ name, id }) => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  onClick={handleSelectedUser}
                  key={id}
                  id={id}
                  className={cn({ 'is-active': isSelectedUser(id) })}
                >
                  {name}
                </a>
              ))
              }
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={inputValue}
                  onChange={handleInputValue}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {inputValue && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setInputValue('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
                id={0}
                // onClick={handleSelectedCategory}
              >
                All
              </a>

              {categoriesFromServer.map(({ id, title }) => (
                <a
                  data-cy="Category"
                  className="button mr-2 my-1 is-info"
                  href="#/"
                  key={id}
                  id={id}
                  // onClick={handleSelectedCategory}
                >
                  {title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => resetFilters()}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0
            ? (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            )
            : (
              <table
                data-cy="ProductTable"
                className="table is-striped is-narrow is-fullwidth"
              >
                <thead>
                  <tr>
                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        ID

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Product

                        <a href="#/">
                          <span className="icon">
                            {/* eslint-disable-next-line max-len */}
                            <i data-cy="SortIcon" className="fas fa-sort-down" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Category

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort-up" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        User

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {visibleProducts.map((product) => {
                    const { id, name, category, user } = product;

                    return (
                      <tr data-cy="Product" key={id}>
                        {/* eslint-disable-next-line max-len */}
                        <td className="has-text-weight-bold" data-cy="ProductId">
                          {id}
                        </td>

                        <td data-cy="ProductName">{name}</td>
                        {category && (
                          <td data-cy="ProductCategory">{`${category.icon} - ${category.title}`}</td>
                        )}

                        {user && (
                          <td
                            data-cy="ProductUser"
                            className={cn({
                              'has-text-link': user.sex === 'm',
                              'has-text-danger': user.sex === 'f',
                            })}
                          >
                            {user.name}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
        </div>
      </div>
    </div>
  );
};
