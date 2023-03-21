import * as actionTypes from '../actions/actionTypes';

const initialState = {
    orders: [],
    loading: false,
    purchased: false
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.PURCHASE_INIT:
            // When an order has been successfully purchased, "purchased" is set to true, which causes the Checkout container to redirect to the home
            // When you go back to the Checkout container to place a new order, purchased is reset back to false through this action type.

            return {
                ...state,
                purchased: false
            };
        case actionTypes.PURCHASE_BURGER_START:
            return {
                ...state,
                loading: true
            };
        case actionTypes.PURCHASE_BURGER_SUCCESS:
            // Storing the order in the "orders" property isn't necessary since it is only used in the Orders container
            // and whenever we access it, the orders are fetched from the server.
            // Still it is good to know how you would store an order in this manner.
            const newOrder = {
                ...action.orderData,
                id: action.orderId
            };
            return {
                ...state,
                loading: false,
                orders: state.orders.concat(newOrder),
                purchased: true
            };
        case actionTypes.PURCHASE_BURGER_FAIL:
            return {
                ...state,
                loading: false
            };
        case actionTypes.FETCH_ORDERS_START:
            return {
                ...state,
                loading: true
            };
        case actionTypes.FETCH_ORDERS_SUCCESS:
            return {
                ...state,
                orders: action.orders,
                loading: false
            };
        case actionTypes.FETCH_ORDERS_FAIL:
            return {
                ...state,
                loading: false
            };
        default:
            return state;
    }
};

export default reducer;
