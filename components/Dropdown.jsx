import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import { GLOBAL_STYLES } from '../styles/styles';

const styles = StyleSheet.create({
  dropdownView: {
    position: "relative"
  },
  selectButton: {
    paddingVertical: '1%',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    display: "flex",
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '3%',
  },
  selectText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  menuView: {
    position: 'absolute',
    backgroundColor: "#FFFFFF",
    top: "100%",
    width: "100%",
    borderRadius: 10,
  },
  optionView: {
    paddingHorizontal: '3%',
    paddingVertical: "2%"
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  }
});

function SelectOption({label, value, onClick}) {
  return (
    <Pressable onPress={() => onClick(value)}>
      <View style={styles.optionView}>
        <Text style={styles.optionText}>{label}</Text>
      </View>
    </Pressable>
  )
}

function Menu({options, onSelect}) {
  return (
    <View style={[styles.menuView, GLOBAL_STYLES.shadow]}>
      {
        options.map(({ label, value }) => (
          <Pressable onPress={() => onSelect(value)} key={`pressable-${label}`}>
            <SelectOption label={label} value={value} key={label}/>
          </Pressable>
        ))
      }
    </View>
  );
}

function Select({selectedOption, isOpened, toggleOpened}) {
  return (
    <Pressable onPress={toggleOpened}>
      <View style={[styles.selectButton, GLOBAL_STYLES.shadow]}>
        <Text style={styles.selectText}>{selectedOption}</Text>
        <AntDesign name={isOpened ? 'caretup' : 'caretdown'} size={14} color="black" />
      </View>
    </Pressable>
  )
}

export default function Dropdown({selectedOption, options, onSelect}) {
  const [isOpened, setOpened] = useState(false);

  const toggleOpened = () => {
    setOpened(!isOpened);
  };

  return (
    <View style={styles.dropdownView}>
      <Select selectedOption={selectedOption.label} isOpened={isOpened} toggleOpened={toggleOpened}/>
      {isOpened ? <Menu options={options} onSelect={onSelect}/> : ''}
    </View>
  );
}
