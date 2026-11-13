<?php

namespace App\Observers;

use App\Models\PushSubscription;

class PushSubscriptionObserver
{
    /**
     * Simpan hash endpoint agar keunikan langganan bisa dijaga unique index.
     *
     * @param  PushSubscription  $subscription
     * @return void
     */
    public function saving(PushSubscription $subscription): void
    {
        $subscription->endpoint_hash = PushSubscription::hashEndpoint($subscription->endpoint);
    }
}
