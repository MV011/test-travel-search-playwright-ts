@UI
Feature: Integration Across Travel Modules
  In order to have a unified travel planning experience
  As a traveler
  I want to navigate seamlessly between Flights, Hotels, Rentals, and other modules

  Background:
    Given the user is redirected to the consent page
    When the user clicks the Accept all cookies button
    And user navigates to the "Hotels search" page
    And the user enters the search term "Tokyo" and submits the search
    And waits for the results to load


    #when going to explore, children get converted to adults, and going back changes everything to adults? not sure if intended or defect
  @Regression
  Scenario: Data consistency - Search to Explore
    When the user opens the guests dialog menu in the search bar
    And the user "increases" the number of Adults by 1
    And the user "increases" the number of Children by 2
    And clicks the Done button in the guest dropdown
    And the user opens the date picker in the search bar
    And sets the check in date to a date in the future
    And user navigates to the "Explore" page
    Then the searched location is displayed first
    And the number of passengers matches the values previously set
    And departure and return dates match the previously set values