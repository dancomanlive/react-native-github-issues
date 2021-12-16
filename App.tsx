import React, {useState, FunctionComponent} from 'react';
import {
  StyleSheet,
  Text,
  Alert,
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from 'react-native';

interface IIssue {
  title: string;
}

const App: FunctionComponent = () => {
  const [organization, setOrganization] = useState<string>('');
  const [repo, setRepo] = useState<string>('');
  const [issues, setIssues] = useState<IIssue[]>([]);
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasScrolled, setScrolled] = useState<boolean>(false);

  const handleOrgChange = (
    evt: NativeSyntheticEvent<TextInputChangeEventData>,
  ): void => {
    const element = evt.nativeEvent.text.toLowerCase().trim();
    setOrganization(element);
  };

  const handleRepoChange = (
    evt: NativeSyntheticEvent<TextInputChangeEventData>,
  ): void => {
    const element = evt.nativeEvent.text.toLowerCase().trim();
    setRepo(element);
  };

  const getRepoIssues = () => {
    const url = `https://api.github.com/repos/${organization}/${repo}/issues?page=${page}&per_page=5`;
    return fetch(url)
      .then(res => res.json())
      .catch(err => console.log('Network error', err));
  };

  const handleSearch = () => {
    setLoading(true);
    getRepoIssues().then(res => {
      if (res?.message) {
        Alert.alert(`${res.message}`);
        return;
      }
      setIssues([...issues, ...res]);
      setLoading(false);
      setPage(page + 1);
    });
  };

  const onScroll = () => setScrolled(true);

  const renderFooter = () => {
    if (!loading) {
      return null;
    }
    return <ActivityIndicator />;
  };

  const renderItem = ({item, index}: {item: IIssue; index: number}) => {
    return (
      <View testID="issue-item" style={styles.item}>
        <Text style={styles.title}>
          {index + 1} - {item.title}
        </Text>
      </View>
    );
  };

  return (
    <View testID="home" style={styles.container}>
      <Text style={styles.label}>Enter organization name</Text>
      <View>
        <TextInput
          testID="organization-text-input"
          placeholder="Facebook"
          style={styles.input}
          onChange={handleOrgChange}
        />
      </View>
      <View style={styles.repoInputView}>
        <Text style={styles.label}>Enter repository name</Text>
        <TextInput
          testID="repo-text-input"
          placeholder="React"
          style={styles.input}
          onChange={handleRepoChange}
        />
      </View>
      <TouchableOpacity
        testID="search"
        onPress={handleSearch}
        style={styles.button}
        activeOpacity={0.8}
        disabled={organization === '' || repo === ''}>
        <Text style={styles.buttonText}>SEARCH ISSUES</Text>
      </TouchableOpacity>
      <FlatList
        onScroll={onScroll}
        data={issues}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        onEndReachedThreshold={0}
        contentInset={{top: 0, bottom: 100, left: 0, right: 0}}
        contentInsetAdjustmentBehavior="automatic"
        ListFooterComponent={renderFooter}
        onEndReached={hasScrolled ? handleSearch : null}
      />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFFFFF',
    top: 100,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    width: Dimensions.get('window').width - 20,
    height: 38,
    padding: 4,
    fontSize: 16,
    borderColor: '#3a3a3a',
    borderWidth: 1,
    borderRadius: 8,
  },
  button: {
    height: 45,
    flexDirection: 'row',
    backgroundColor: '#263238',
    borderColor: '#263238',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    alignSelf: 'center',
  },
  repoInputView: {
    paddingVertical: '5%',
  },
  item: {
    backgroundColor: '#dcdcdc',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    marginHorizontal: 4,
  },
  title: {
    fontSize: 12,
  },
});
