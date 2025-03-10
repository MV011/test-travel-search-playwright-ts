@UI @Regression
Feature: Filters and Sorting
  In order to refine travel options
  As a traveler
  I want to apply filters and sorting criteria to narrow down or reorder my search results

  Background:
    Given the user is redirected to the consent page
    When the user clicks the Accept all cookies button

  @Smoke
  Scenario: Verify sorting by lowest price and modifying the price range
    Given user navigates to the "Hotels search" page
    When the user enters the search term "New York" and submits the search
    And the All Filters modal is opened
    And the user sets the sorting order to "Lowest price"
    And increases the minimum price to 25 percent
    And the Close Filters Dialog button is clicked
    Then the results list matches the sort order
    And no results that are cheaper than the minimum price are displayed

    #Incomplete last step
  @Regression
  Scenario Outline: User searches for hotels using specific filter criteria
    Given user navigates to the "Hotels search" page
    And the currency is changed to "EUR"
    When the user enters the search term "Bucharest" and submits the search
    And the All Filters modal is opened
    And the user sets the sorting order to "<sortBy>"
    And sets price range from <priceMinPercentage> to <priceMaxPercentage>
    And selects "<propertyType>" as the property type
    And selects free cancellation option as "<freeCancellation>"
    And sets guest rating filter to "<guestRating>"
    And chooses "<hotelClass>" hotels
    And selects amenities "<amenities>"
    And sets sustainability option to "<sustainability>"
    Then relevant hotel results matching the filters are displayed
    Examples:
      | sortBy         | priceMinPercentage | priceMaxPercentage | propertyType    | freeCancellation | guestRating | hotelClass | amenities    | sustainability |
      | Lowest price   | 25                 | 50                 | Hostels         | Yes              | Any         | No         | Parking      | No             |
      | Highest rating | 50                 | 70                 | Boutique hotels | No               | 4.5+        | 3-star     | Parking      | No             |
      | Most reviewed  | 70                 | 80                 | Spa hotels      | Yes              | 3.5+        | 4-star     | Pool         | No             |
      | Relevance      | 0                  | 100                | Other           | No               | 4.0+        | 5-star     | Free parking | Eco-certified  |