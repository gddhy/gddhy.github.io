MODDIR=${0%/*}
echo "现在的数据默认卡是卡1还是2，卡1请输入1，卡2请输入2"
read choose
if [[ $choose != "1" && $choose != "2"  ]];then
echo "输入有误，请重新执行脚本"
exit 0
fi
out_first_slot=$choose
inter_first_slot=`settings get global multi_sim_data_call`
inter_first_prop_slot=`getprop persist.radio.default.data`
echo "请切换数据到另一张卡，并输入卡数字，卡1输入1，卡2输入2"
read choose
if [[ $choose != "1" && $choose != "2"  ]];then
echo "输入有误，请重新执行脚本"
exit 0
fi
out_second_slot=$choose
inter_second_slot=`settings get global multi_sim_data_call`
inter_second_prop_slot=`getprop persist.radio.default.data`
if [[ $out_first_slot == $out_second_slot ]];then
echo "您两次输入的卡槽号一致，请重新执行脚本"
exit 0
fi
if [[ $inter_first_slot == $inter_second_slot ]];then
echo "您似乎未按提示未切换过上网卡，请重新执行脚本，根据提示在恰当时机切换上网卡"
exit 0
fi
echo "if [[ \`settings get global multi_sim_data_call\` == \"$inter_first_slot\" ]];then
SimDataSlot=$inter_second_slot
SimDataPropSlot=$inter_second_prop_slot
echo \"上网卡已切换到卡$out_second_slot\"
elif [[ \`settings get global multi_sim_data_call\` == \"$inter_second_slot\" ]];then
SimDataSlot=$inter_first_slot
SimDataPropSlot=$inter_first_prop_slot
echo \"上网卡已切换到卡$out_first_slot\"
fi
settings put global multi_sim_data_call \$SimDataSlot
setprop persist.radio.default.data \$SimDataPropSlot
am start com.android.stk/.ToneDialog >/dev/null 2>&1 &" > $MODDIR/切换上网卡.sh