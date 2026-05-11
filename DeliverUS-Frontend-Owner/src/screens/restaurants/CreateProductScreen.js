import { useEffect, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Formik } from 'formik'
import DropDownPicker from 'react-native-dropdown-picker'
import { showMessage } from 'react-native-flash-message'

import InputItem from '../../components/InputItem'
import TextRegular from '../../components/TextRegular'
import ImagePicker from '../../components/ImagePicker'

import * as GlobalStyles from '../../styles/GlobalStyles'

import defaultProductImage from '../../../assets/product.jpeg'

import { getProductCategories } from '../../api/ProductEndpoints'

export default function CreateProductScreen ({ navigation, route }) {
  const [productCategories, setProductCategories] = useState([])
  const [open, setOpen] = useState(false)

  const initialProductValues = {
    name: null,
    description: null,
    price: null,
    image: null,
    order: null,
    productCategory: null,
    availability: false
  }

  useEffect(() => {
    async function fetchProductCategories () {
      try {
        const fetchedProductCategories = await getProductCategories()

        const fetchedProductCategoriesReshaped =
          fetchedProductCategories.map(category => {
            return {
              label: category.name,
              value: category.id
            }
          })

        setProductCategories(fetchedProductCategoriesReshaped)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving product categories. ${error}`,
          type: 'error',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    }

    fetchProductCategories()
  }, [])

  return (
    <Formik
      initialValues={initialProductValues}
    >
      {({ setFieldValue, values }) => (
        <ScrollView>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: '60%' }}>
              <InputItem
                name='name'
                label='Name:'
              />

              <InputItem
                name='description'
                label='Description:'
              />

              <InputItem
                name='price'
                label='Price:'
              />

              <InputItem
                name='order'
                label='Order:'
              />

              <DropDownPicker
                open={open}
                value={values.productCategory}
                items={productCategories}
                setOpen={setOpen}
                setItems={setProductCategories}
                onSelectItem={item => {
                  setFieldValue('productCategory', item.value)
                }}
                placeholder='Select the product category'
                containerStyle={{
                  height: 40,
                  marginTop: 20,
                  marginBottom: open ? 120 : 20
                }}
                style={{
                  backgroundColor: GlobalStyles.brandBackground
                }}
                dropDownContainerStyle={{
                  backgroundColor: '#fafafa'
                }}
              />

              <TextRegular>
                Is it available?
              </TextRegular>

              <Switch
                trackColor={{
                  false: GlobalStyles.brandSecondary,
                  true: GlobalStyles.brandPrimary
                }}
                thumbColor={
                  values.availability
                    ? GlobalStyles.brandSecondary
                    : '#f4f3f4'
                }
                value={values.availability}
                style={styles.switch}
                onValueChange={value => {
                  setFieldValue('availability', value)
                }}
              />

              <ImagePicker
                label='Image:'
                image={values.image}
                defaultImage={defaultProductImage}
                onImagePicked={result => setFieldValue('image', result)}
              />

              <Pressable
                onPress={() => console.log('Submit pressed')}
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? GlobalStyles.brandSuccessTap
                      : GlobalStyles.brandSuccess
                  },
                  styles.button
                ]}
              >
                <View
                  style={[
                    {
                      flex: 1,
                      flexDirection: 'row',
                      justifyContent: 'center'
                    }
                  ]}
                >
                  <MaterialCommunityIcons
                    name='content-save'
                    color='white'
                    size={20}
                  />

                  <TextRegular textStyle={styles.text}>
                    Save
                  </TextRegular>
                </View>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      )}
    </Formik>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    height: 40,
    padding: 10,
    width: '100%',
    marginTop: 20,
    marginBottom: 20
  },
  text: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginLeft: 5
  },
  switch: {
    marginTop: 20,
    marginBottom: 20
  }
})
