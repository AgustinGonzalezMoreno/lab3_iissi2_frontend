import { useEffect, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Formik } from 'formik'
import DropDownPicker from 'react-native-dropdown-picker'
import { showMessage } from 'react-native-flash-message'

import { getRestaurantCategories } from '../../api/RestaurantEndpoints'

import InputItem from '../../components/InputItem'
import TextRegular from '../../components/TextRegular'
import ImagePicker from '../../components/ImagePicker'

import * as GlobalStyles from '../../styles/GlobalStyles'

import restaurantLogo from '../../../assets/restaurantLogo.jpeg'
import restaurantBackground from '../../../assets/restaurantBackground.jpeg'

export default function CreateRestaurantScreen () {
  const [restaurantCategories, setRestaurantCategories] = useState([])
  const [open, setOpen] = useState(false)

  const initialRestaurantValues = {
    name: null,
    description: null,
    address: null,
    postalCode: null,
    url: null,
    shippingCosts: null,
    email: null,
    phone: null,
    restaurantCategoryId: null,
    logo: null,
    heroImage: null
  }

  useEffect(() => {
    async function fetchRestaurantCategories () {
      try {
        const fetchedRestaurantCategories = await getRestaurantCategories()

        const fetchedRestaurantCategoriesReshaped =
          fetchedRestaurantCategories.map(category => {
            return {
              label: category.name,
              value: category.id
            }
          })

        setRestaurantCategories(fetchedRestaurantCategoriesReshaped)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving restaurant categories. ${error}`,
          type: 'error',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    }

    fetchRestaurantCategories()
  }, [])

  return (
    <Formik
      initialValues={initialRestaurantValues}
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
                name='address'
                label='Address:'
              />

              <InputItem
                name='postalCode'
                label='Postal code:'
              />

              <InputItem
                name='url'
                label='Url:'
              />

              <InputItem
                name='shippingCosts'
                label='Shipping costs:'
              />

              <InputItem
                name='email'
                label='Email:'
              />

              <InputItem
                name='phone'
                label='Phone:'
              />

              <DropDownPicker
                open={open}
                value={values.restaurantCategoryId}
                items={restaurantCategories}
                setOpen={setOpen}
                setItems={setRestaurantCategories}
                onSelectItem={item => {
                  setFieldValue('restaurantCategoryId', item.value)
                }}
                placeholder='Select the restaurant category'
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

              <ImagePicker
                label='Logo:'
                image={values.logo}
                defaultImage={restaurantLogo}
                onImagePicked={result => setFieldValue('logo', result)}
              />

              <ImagePicker
                label='Hero Image:'
                image={values.heroImage}
                defaultImage={restaurantBackground}
                onImagePicked={result => setFieldValue('heroImage', result)}
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
  }
})
