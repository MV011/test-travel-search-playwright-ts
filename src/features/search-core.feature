@UI
Feature: Core Search Functionality
  In order to use Google Travel effectively
  As a traveler
  I want to see relevant results for my basic searches and handle error cases gracefully

  Background:
    Given the user is redirected to the consent page
    When the user clicks the Accept all cookies button

  @Smoke
  Scenario: Search query returns relevant results
    Given user navigates to the "Vacation rentals" page
    And the currency is changed to "EUR"
    And the search result prices reflect the "EUR" currency
    When the user enters the search term "Tokyo" and submits the search
    And waits for the results to load
    Then the search results for "Tokyo" are displayed

  @Smoke
  Scenario: Search bar suggestions
    Given user navigates to the "Hotels search" page
    When the user enters the search term "Austin"
    Then list of suggestions containing "accommodations and flights for the location" is displayed below the search bar

  @Regression @Negative
  Scenario: Graceful handling of invalid input
    Given user navigates to the "Hotels search" page
    When the user enters the search term "asdf1234??" and submits the search
    Then no results are displayed and the "No properties exactly match your search" message is shown

  @Regression @Negative
  Scenario: Graceful handling of no results
    Given user navigates to the "Hotels search" page
    When the user enters the search term "Bucharest" and submits the search
    And waits for the results to load
    And the All Filters modal is opened
    And selects "Hostels" as the property type
    And sets price range from 95 to 100
    Then no results are displayed and the "No results" message is shown

  @Smoke
  Scenario: Using the date picker to select check-in and check-out dates
    Given user navigates to the "Hotels search" page
    When the user enters the search term "Paris" and submits the search
    And waits for the results to load
    #update check-in
    And the user opens the date picker in the search bar
    And sets the check in date to a date in the future
    And clicks the Date Picker Done button
    And waits for the results to load
    Then the selected check-in date is displayed in the search bar
    #Update check-out
    When the user opens the date picker in the search bar
    And presses the date picker arrow to "increase" the checkout date by 5 days
    And clicks the Date Picker Done button
    And waits for the search results to be visible
    Then the selected check-out date is displayed in the search bar

  @Regression
  Scenario: Selecting a check out date earlier than the check-in date
    Given user navigates to the "Hotels search" page
    And the user opens the date picker in the search bar
    And sets the check in date to a date in the future
    And clicks the Date Picker Done button
    And waits for the search results to be visible
    When the user opens the date picker in the search bar
    And the user selects a check-out date earlier than the check-in date
    And clicks the Date Picker Done button
    And waits for the search results to be visible
    Then the check-in date is one day before the new check-out date

  @Regression @Negative
  Scenario: Selecting past dates in the date picker
    Given user navigates to the "Hotels search" page
    When the user opens the date picker in the search bar
    And selects a check-in date earlier than today's date
    And clicks the Date Picker Done button
    Then the check-in date remains unchanged
    When the user opens the date picker in the search bar
    And selects a check-out date earlier than today's date
    And clicks the Date Picker Done button
    Then the check-out date remains unchanged

  @Smoke
  Scenario: Changing the number of guests
    Given user navigates to the "Hotels search" page
    Then the search bar is set to the default of 2 guests
    When the user opens the guests dialog menu in the search bar
    And the user "increases" the number of Adults by 1
    And the user "increases" the number of Children by 2
    And clicks the Done button in the guest dropdown
    Then the total number of guests is 5
    And the data in the dialog menu is saved

