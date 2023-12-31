// ChartDataHook.js
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { AskUs } from '../../api/askus/AskUs';

export const useChartData = () => {
  const { chartReady, chartData } = useTracker(() => {
    const subscription = Meteor.subscribe(AskUs.userPublicationName);
    const items = AskUs.collection.find().fetch();

    const processedData = items.map(item => ({
      label: item.question,
      value: item.freq,
    }));

    return {
      chartData: processedData,
      chartReady: subscription.ready(),
    };
  }, []);

  return { chartReady, chartData };
};
