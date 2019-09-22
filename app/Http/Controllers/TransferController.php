<?php

namespace App\Http\Controllers;

use Validator;
use Illuminate\Http\Request;
use App\Transfer;
use App\Wallet;

class TransferController extends Controller
{
    public function store(Request $request){

        // $validatedData = $request->validate([
        //     'amount' => 'number|max:999999|required',
        //     'description' => 'required|max:255',
        //     'wallet_id' => 'required',
        // ]);

        // $validator = Validator::make($request->all(), [
        //     'amount' => 'numeric|max:999999|required',
        //     'description' => 'required|max:255',
        //     'wallet_id' => 'required',
        // ]);

        // if ($validator->fails()) {
        //     return response()->json(['error' => $validator]);
        // }

        $wallet = Wallet::find($request->wallet_id);
        $wallet->money = $wallet->money + $request->amount;
        $wallet->update();

        $transfer = new Transfer();

        $transfer->description = $request->description;
        $transfer->amount = $request->amount;
        $transfer->wallet_id = $request->wallet_id;
        $transfer->save();

        return response()->json($transfer, 201);
    }

    public function delete(Request $request){
        try {
            $transfer = Transfer::where('id', $request->id)->FirstOrFail();
            $wallet = Wallet::where('id', $transfer->wallet_id)->firstOrFail();
            // dd($transfer);
            $wallet->money = $wallet->money - $transfer->amount;

            $wallet->update();
            $transfer->delete();

            return response()->json(['success' => true]);
        } catch (\Throwable $th) {
            return response()->json(['success' => false]);
        }
    }
}
