// path: app/(tabs)/reports.tsx (versão aprimorada)

import React, { useContext, useMemo } from 'react';
import { Dimensions, Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { ThemeContext } from '../themeContext';
import { TransactionsContext } from '../transactionsContext';

export default function Reports() {
  const { darkMode } = useContext(ThemeContext);
  const { transactions } = useContext(TransactionsContext);

  const greenTone = '#2a9d8f';
  const redTone   = '#e76f51';
  const backgroundColor = darkMode ? '#264653' : '#f0f4f8';
  const textColor       = darkMode ? '#f0f4f8' : '#264653';
  const legendColor     = darkMode ? '#ccc' : '#333';

  const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

  const { totalEntradas, totalSaidas, categoryData } = useMemo(() => {
    const totalEntradas = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalSaidas = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const catMap: Record<string, number> = {};
    transactions.forEach(t => {
      if (!t.category) return;
      catMap[t.category] = (catMap[t.category] || 0) + t.amount;
    });

    const categoryData = Object.keys(catMap).map((name, i) => ({
      name,
      population: catMap[name],
      color: `hsl(${(i*57)%360} 70% 55%)`,
      legendFontColor: legendColor,
      legendFontSize: 12,
    }));

    return { totalEntradas, totalSaidas, categoryData };
  }, [transactions, legendColor]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
      <Text style={[styles.title, { color: textColor }]}>📊 Relatórios</Text>

      <View style={styles.summary}>
        <Text style={[styles.summaryText, { color: greenTone }]}>
          Total Entradas: {formatCurrency(totalEntradas)}
        </Text>
        <Text style={[styles.summaryText, { color: redTone }]}>
          Total Saídas: {formatCurrency(totalSaidas)}
        </Text>
      </View>

      <Text style={[styles.chartTitle, { color: textColor }]}>Gastos por Categoria</Text>
      {categoryData.length > 0 ? (
        <PieChart
          data={categoryData}
          width={Dimensions.get('window').width - 32}
          height={220}
          chartConfig={{
            backgroundColor: backgroundColor,
            backgroundGradientFrom: backgroundColor,
            backgroundGradientTo: backgroundColor,
            color: (opacity=1) => darkMode ? `rgba(255,255,255,${opacity})` : `rgba(0,0,0,${opacity})`,
            labelColor: (opacity=1) => darkMode ? `rgba(255,255,255,${opacity})` : `rgba(0,0,0,${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      ) : (
        <Text style={{ textAlign:'center', marginTop:16, color: textColor }}>Nenhuma categoria encontrada.</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, padding:16, paddingTop: Platform.OS==='android' ? (StatusBar.currentHeight||0)+16 : 16 },
  title:{ fontSize:22, fontWeight:'700', marginBottom:12, textAlign:'center' },
  summary:{ marginBottom:16 },
  summaryText:{ fontSize:16, fontWeight:'700' },
  chartTitle:{ fontSize:16, fontWeight:'700', marginBottom:8, textAlign:'center' },
});
