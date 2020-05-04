/* eslint-disable no-nested-ternary */
import CustomRadio from '@components/Forms/Radio';
import SelectColor from '@components/Forms/SelectColor';
import SelectSize from '@components/Forms/SelectSize';
import Typography from '@components/Typography';
import { MenuItem, Select } from '@material-ui/core';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ProductByVariant, { getCombinationVariants, CheckAvailableOptions } from '@helpers/productByVariant';
import { setCountCart } from '@stores/actions/cart';
import { GraphCart } from '@services/graphql';
import { getToken } from '@helpers/token';
import { getCartId, setCartId } from '@helpers/cartId';
import { addConfigProductsToCart, getConfigurableProduct } from '../../services/graphql';
import { setConfigurable, setProductSelected } from '../../redux/action';
import Footer from './Footer';
import useStyles from './style';

export default (props) => {
    const {
        setBanner,
        setPrice,
        t,
        data: { __typename, sku },
        setMessage,
        setOpen,
        loading,
        setLoading,
    } = props;
    const styles = useStyles();
    const dispatch = useDispatch();

    const productState = useSelector((state) => state.product);

    const [qty, setQty] = React.useState(1);
    const handleQty = (event) => {
        setQty(event.target.value);
    };

    const { data } = getConfigurableProduct(sku);

    const selected = productState.selectConfigurable;

    const [firstSelected, setFirstSelected] = React.useState({});

    const handleSelect = async (value, key) => {
        const options = firstSelected.code === key && firstSelected.value !== value ? {} : selected;
        options[key] = value;
        dispatch(
            setConfigurable({
                [key]: value,
            }),
        );
        const product = await ProductByVariant(options, data.products.items[0].variants);
        if (product && JSON.stringify(product) !== '{}') {
            dispatch(setProductSelected(product));
            const bannerData = product.media_gallery.map((media) => ({
                link: '#',
                imageUrl: media.url,
            }));
            setBanner(bannerData);
            setPrice({
                priceRange: product.price_range,
                priceTiers: product.price_tiers,
                // eslint-disable-next-line no-underscore-dangle
                productType: product.__typename,
            });
        } else {
            const bannerData = data.media_gallery.map((media) => ({
                link: '#',
                imageUrl: media.url,
            }));
            setBanner(bannerData);
            setPrice({
                priceRange: data.price_range,
                priceTiers: product.price_tiers,
                // eslint-disable-next-line no-underscore-dangle
                productType: data.__typename,
            });
        }

        if (firstSelected.code === key) {
            firstSelected.value = value;
        } else if (!firstSelected.code) {
            firstSelected.code = key;
            firstSelected.value = value;
        }
        await setFirstSelected({ ...firstSelected });
    };

    let cartId = '';
    let tokenCustomer = '';

    if (typeof window !== 'undefined') {
        tokenCustomer = getToken();
        cartId = getCartId();
    }

    const [addCartConfig] = addConfigProductsToCart(tokenCustomer);
    const [getGuestCartId] = GraphCart.getGuestCartId();

    const [error, setError] = React.useState({});

    const handleAddToCart = async () => {
        const errorMessage = {
            variant: 'error',
            text: t('product:failedAddCart'),
            open: true,
        };
        const errorData = {};
        // eslint-disable-next-line array-callback-return
        data.products.items[0].configurable_options.map((option) => {
            if (selected[option.attribute_code] === '' || !selected[option.attribute_code]) {
                errorData[option.attribute_code] = `${option.attribute_code} ${t('validate:required')}`;
            }
        });
        setError(errorData);
        if (JSON.stringify(errorData) === '{}') {
            setLoading(true);
            if (!cartId || cartId === '' || cartId === undefined) {
                if (tokenCustomer === '' || !tokenCustomer) {
                    await getGuestCartId()
                        .then((res) => {
                            const token = res.data.createEmptyCart;
                            cartId = token;
                            setCartId(token);
                        })
                        .catch(() => {
                            setLoading(false);
                            setMessage(errorMessage);
                        });
                }
            }

            if (__typename === 'ConfigurableProduct') {
                const variables = {
                    cartId,
                    sku: productState.product.sku,
                    qty: parseFloat(qty),
                    parentSku: sku,
                };
                addCartConfig({
                    variables,
                })
                    .then((res) => {
                        dispatch(setCountCart(res.data.addConfigurableProductsToCart.cart.total_quantity));
                        setMessage({ variant: 'success', text: t('product:successAddCart'), open: true });
                        setLoading(false);
                        setOpen(false);
                    })
                    .catch(() => {
                        setLoading(false);
                        setMessage(errorMessage);
                    });
            }
        }
    };

    const classItem = styles.stylesItemOption;

    const combination = data && getCombinationVariants(firstSelected, data.products.items[0].variants);
    return (
        <>
            {data
                && data.products.items[0].configurable_options.map((option, index) => {
                    const value = [];
                    for (
                        let valIdx = 0;
                        valIdx < option.values.length;
                        // eslint-disable-next-line no-plusplus
                        valIdx++
                    ) {
                        if (value.indexOf(option.values[valIdx].label) === -1) {
                            const initValue = {
                                label: option.values[valIdx].label,
                                value: option.values[valIdx].label,
                                disabled: false,
                            };
                            if (combination.available_combination.length > 0 && combination.code !== option.attribute_code) {
                                const available = CheckAvailableOptions(combination.available_combination, option.values[valIdx].label);
                                if (!available) initValue.disabled = true;
                            }
                            value.push(initValue);
                        }
                    }
                    if (option.attribute_code === 'color') {
                        return (
                            <CustomRadio
                                key={index}
                                label="Select color"
                                flex="row"
                                CustomItem={SelectColor}
                                value={selected[option.attribute_code]}
                                valueData={value}
                                onChange={(val) => handleSelect(val, option.attribute_code)}
                                className={styles.label}
                                classContainer={styles.center}
                                classItem={classItem}
                                error={!!error[option.attribute_code] && !selected[option.attribute_code]}
                                errorMessage={error[option.attribute_code] ? error[option.attribute_code] : ''}
                                disabled={loading}
                            />
                        );
                    }
                    if (option.attribute_code === 'size') {
                        return (
                            <CustomRadio
                                key={index}
                                label="Select size"
                                flex="row"
                                CustomItem={SelectSize}
                                value={selected[option.attribute_code]}
                                valueData={value}
                                onChange={(val) => handleSelect(val, option.attribute_code)}
                                className={styles.sizeContainer}
                                classContainer={styles.center}
                                classItem={classItem}
                                error={!!error[option.attribute_code] && !selected[option.attribute_code]}
                                errorMessage={error[option.attribute_code] ? error[option.attribute_code] : ''}
                                disabled={loading}
                            />
                        );
                    }

                    return (
                        <div key={index} className={styles.select}>
                            <Typography align="center" variant="label" type="bold" letter="uppercase">
                                {`Select ${option.label}`}
                            </Typography>
                            <Select
                                value={selected[option.attribute_code] || ''}
                                onChange={(val) => handleSelect(val.target.value, option.attribute_code)}
                                disabled={loading}
                            >
                                {value.map((val, key) => (
                                    <MenuItem key={key} value={val.label} disabled={val.disabled}>
                                        {val.label}
                                    </MenuItem>
                                ))}
                            </Select>
                            {error[option.attribute_code] && !selected[option.attribute_code] && (
                                <Typography variant="p" color="red">
                                    {error[option.attribute_code]}
                                </Typography>
                            )}
                        </div>
                    );
                })}
            <Footer qty={qty} handleAddToCart={handleAddToCart} handleQty={handleQty} t={t} loading={loading} />
        </>
    );
};