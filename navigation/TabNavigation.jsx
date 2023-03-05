"use strict";

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import ShortTeachPlan from "../screens/shortTeachPlan/shortTeachPlan";
import TimeTablePage from "../screens/timeTable/TimeTable";

import { GLOBAL_STYLES } from "../styles/styles";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
      <Tab.Navigator screenOptions={GLOBAL_STYLES.buttomNavigator}>
        <Tab.Screen
          name="Расписание"
          component={TimeTablePage}
          options={{
            headerShown: false
          }}
        />
        <Tab.Screen
          name="Учебный план"
          component={ShortTeachPlan}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    );
  }


export default TabNavigator;