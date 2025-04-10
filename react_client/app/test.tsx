import { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

export default function Test() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/members")
      .then(res => res.json())
      .then(data => setMembers(data.members));
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Members:</Text>
      {members.map((member, i) => (
        <Text key={i}>{member}</Text>
      ))}
    </View>
  );
}