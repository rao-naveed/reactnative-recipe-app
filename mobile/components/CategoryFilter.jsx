import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Image } from "expo-image";
import { homeStyles } from "../assets/styles/home.styles";

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}) {
  return (
    <View style={homeStyles.categoryFilterContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={homeStyles.categoryFilterScrollContent}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.name;

          return (
            <TouchableOpacity
              key={category.id}
              activeOpacity={0.8}
              onPress={() => onSelectCategory(category.name)}
              style={[
                homeStyles.categoryButton,
                isSelected && homeStyles.selectedCategory,
              ]}
            >
              <Image
                source={{ uri: category.image }}
                style={homeStyles.categoryImage}
                contentFit="cover"
                transition={300}
              />

              <View
                style={[
                  homeStyles.categoryLabel,
                  isSelected && homeStyles.selectedCategoryLabel,
                ]}
              >
                <Text
                  numberOfLines={1}
                  style={[
                    homeStyles.categoryText,
                    isSelected && homeStyles.selectedCategoryText,
                  ]}
                >
                  {category.name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}