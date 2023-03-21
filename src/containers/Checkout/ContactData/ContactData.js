import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.module.css';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';

class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIP code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your email'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        { value: 'fastest', displayValue: 'Fastest' },
                        { value: 'cheapest', displayValue: 'Cheapest' }
                    ]
                },
                value: 'fastest',
                // The following two properties are required to avoid errors even though validation is not implemented
                validation: {},
                valid: true
            }
        },
        formIsValid: false
    };

    orderHandler = (event) => {
        event.preventDefault();

        const formData = {};

        for (let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] =
                this.state.orderForm[formElementIdentifier].value;
        }

        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderData: formData
        };

        this.props.onOrderBurger(order, this.props.token);
    };

    checkValidity(value, rules) {
        let isValid = true;

        if (rules.required) {
            isValid = value.trim() !== '' && isValid;
        }

        if (rules.minLength) {
            isValid = value.length >= rules.minLength && isValid;
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid;
        }

        return isValid;
    }

    inputChangedHandler = (event, inputIdentifier) => {
        // This is not a deep copy
        const updatedOrderForm = {
            ...this.state.orderForm
        };

        // Copying the property for the input field being updated
        updatedOrderForm[inputIdentifier] = {
            ...updatedOrderForm[inputIdentifier],
            value: event.target.value,
            valid: this.checkValidity(
                event.target.value,
                updatedOrderForm[inputIdentifier].validation
            ),
            touched: true
        };

        // Check if all the input values are valid.
        // This is required so "Order" button is enabled only when all values are valid.
        let formIsValid = true;
        for (let inputIdentifier in updatedOrderForm) {
            formIsValid =
                updatedOrderForm[inputIdentifier].valid && formIsValid;
        }

        this.setState({ orderForm: updatedOrderForm, formIsValid });
    };

    render() {
        const formElements = [];

        for (let key in this.state.orderForm) {
            formElements.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }

        let form = (
            <form onSubmit={this.orderHandler}>
                {formElements.map((formElement) => (
                    <Input
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        changed={(event) =>
                            this.inputChangedHandler(event, formElement.id)
                        }
                    />
                ))}
                <Button disabled={!this.state.formIsValid} btnType='Success'>
                    ORDER
                </Button>
            </form>
        );
        if (this.props.loading) {
            form = <Spinner />;
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {form}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onOrderBurger: (orderData, token) =>
            dispatch(actions.purchaseBurger(orderData, token))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withErrorHandler(ContactData, axios));
